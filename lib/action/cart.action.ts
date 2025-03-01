'use server'
import {CartItem} from "@/types";
import {convertToPlainObject, formatError, round2} from "../utils";
import {cookies} from "next/headers";
import {auth} from "@/auth";
import {prisma} from "@/db/prisma";
import {cartItemSchema, insertCartSchema} from "@/lib/validators";
import {revalidatePath} from "next/cache";
import {Prisma} from "@prisma/client";

//Calculate cart price
const calcPrice = (items: CartItem[]) => {
    const itemsPrice = round2(items.reduce((acc, item) => acc + (Number(item.price) + Number.EPSILON) * item.qty, 0)),
        shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
        taxPrice = round2(itemsPrice * 0.15),
        totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: (totalPrice).toFixed(2),
    }
}

export async function addItemToCart(data: CartItem) {

    try {
        //Check for cart cookie
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if (!sessionCartId) throw new Error('Session cart id not found');
        //Get User session Id
        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : undefined;

        // Get cart
        const cart = await getCartItems();

        //Parse and validate item
        const item = cartItemSchema.parse(data);

        const product = await prisma.product.findFirst({
            where: {id: item.productId}
        });

        if (!product) throw new Error('Product not found');

        if (!cart) {
            //create new cart object
            const newCart = insertCartSchema.parse({
                userId: userId,
                sessionCartId: sessionCartId,
                items: [item],
                ...calcPrice([item])
            });
            console.log(newCart);
            //insert to databse
            await prisma.cart.create({
                data: newCart
            });
            //revalidate product page
            revalidatePath(
                `/product/${product.slug}`);
            return {
                success: true,
                message: `${product.name} added to cart`
            }
        } else {
            //Check if cart already exist
            const cartExist = cart.items.find(i => i.productId === item.productId);
            if (cartExist) {
                if (product.stock < cartExist.qty + 1) {
                    throw new Error('Product stock is not enough');
                }
                //increase the quantity\
                (cart.items as CartItem[]).find((x) => x.productId === cartExist.productId)!.qty = cartExist.qty + 1;
            } else {
                //If item doesn't exist in cart
                //Check stock
                if (product.stock < 1) throw new Error('Product stock is not enough');
                //Add item to the cart item
                cart.items.push(item);
            }
            //Save to database
            await prisma.cart.update({
                where: {id: cart.id},
                data: {
                    items: cart.items as Prisma.CartUpdateitemsInput[],
                    ...calcPrice(cart.items as CartItem[])
                }
            });
            revalidatePath(`/product/${product.slug}`);
            return {
                success: true,
                message: `${product.name} ${cartExist ? "update to" : "added to"}  cart`
            }
        }

    } catch (error) {
        return {
            success: true,
            message: formatError(error),
        }
    }
}

export async function getCartItems() {
    //Check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Session cart id not found');
    //Get session  and userId
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    //Get user cart from database
    const cart = await prisma.cart.findFirst({
        where: userId ? {userId: userId} : {sessionCartId: sessionCartId}
    });
    if (!cart) return undefined;
    //Convert decimal and return
    return convertToPlainObject({
        ...cart,
        items: cart.items as CartItem[],
        itemPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
    });
}

export async function removeItemFromCart(productId: String) {
    try {
        //Check for cart cookie
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if (!sessionCartId) throw new Error('Session cart id not found');
        //Get the product
        const product = await prisma.product.findFirst({
            where: {id: productId}
        });
        if (!product) throw new Error('Product not found');
        //Get User cart
        const cart = await getCartItems();
        if (!cart) throw new Error('Cart not found');
        //Check for item
        const existCart = (cart.items as CartItem[]).find(i => i.productId === productId);
        if (!existCart) throw new Error('Item not found');
        //Check if only one in qty
        if (existCart.qty === 1) {
            //remove the cart
            cart.items = (cart.items as CartItem[]).filter(i => i.productId !== productId);
        } else {
            //decrease qty
            (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty = existCart.qty - 1;
        }
        //update cart to database
        await prisma.cart.update({
            where: {id: cart.id},
            data: {
                items: cart.items as Prisma.CartUpdateitemsInput[],
                ...calcPrice(cart.items as CartItem[])
            }
        });
        revalidatePath(`/product/${product.slug}`);
        return {
            success: true,
            message: `${product.name} removed from cart`
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        }
    }
}