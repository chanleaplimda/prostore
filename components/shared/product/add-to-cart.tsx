'use client'
import React, {useTransition} from 'react';
import {Cart, CartItem} from '@/types';
import {Button} from '@/components/ui/button';
import {useRouter} from "next/navigation";
import {addItemToCart, removeItemFromCart} from "@/lib/action/cart.action";
import {toast} from "sonner";
import {Loader, MinusIcon, Plus} from "lucide-react";

const AddToCart = ({cart, item}: { cart?: Cart, item: CartItem }) => {
    const [isPending, startTransition] = useTransition();
    const route = useRouter();
    //Add to cart
    const handleAddToCart = async () => {
        startTransition(async () => {
            const res = await addItemToCart(item);
            //failed add to cart
            if (!res.success) {
                toast.error(res.message);
                return;
            }
            //Handle success add to cart
            toast.success(res.message, {
                action: {
                    label: 'View Cart',
                    onClick: () => route.push('/cart')
                }
            });
        });
    }
    //Remove from cart
    const handleRemoveFromCart = async () => {
        startTransition(async () => {
            const res = await removeItemFromCart(item.productId);
            toast.success(res.message);
            return;
        });
    }
    //Check if item is in cart
    const existItem = cart && cart?.items.find(i => i.productId === item.productId);
    return existItem ? (
        <div className="flex flex-row items-center">
            <Button className='w-full' variant='outline' onClick={handleRemoveFromCart}>
                {isPending ? (<Loader className='h-4 w-4 animate-spin'/>) : (<MinusIcon className='w-4 h-4 '/>)}
            </Button>
            <span className='text-sm px-2'>{existItem.qty}</span>
            <Button className='w-full' variant='outline' onClick={handleAddToCart}>
                {isPending ? (<Loader className='h-4 w-4 animate-spin'/>) : (<Plus className='w-4 h-4 '/>)}
            </Button>
        </div>
    ) : (
        <Button type='button' className='w-full' onClick={handleAddToCart}>
            {isPending ? (<Loader className='h-4 w-4 animate-spin'/>) : (<Plus className='w-4 h-4'/>)} Add to Cart
        </Button>
    )
};

export default AddToCart;