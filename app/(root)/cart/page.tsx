import React from 'react';
import CartTable from "@/app/(root)/cart/cart-table";
import {getCartItems} from "@/lib/action/cart.action";

export const metadata = {
    title: "Cart",
}

const CartPage = async () => {
    const cart = await getCartItems();
    return (
        <CartTable cart={cart}/>
    );
};

export default CartPage;