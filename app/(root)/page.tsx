import React from 'react';
import ProductList from "@/components/shared/product/product-list";
import {getLatestProduct} from "@/lib/action/product.actions";


const Homepage = async () => {
    const latestProduct = await getLatestProduct();
    return (
        <ProductList data={latestProduct} title="New Arrival" limit={4}></ProductList>
    );
};

export default Homepage;