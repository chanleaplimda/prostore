import React from 'react';
import {Card, CardContent, CardDescription, CardHeader} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import ProductPrice from "@/components/shared/product/product-price";

const ProductCard = ({product}: { product: any }) => {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="p-0 items-center">
                <Link href={`/product/${product.slug}`}></Link>
                <Image src={product.images[0]} alt={product.name} height={300} width={300} priority={true}/>
            </CardHeader>
            <CardContent className='p-4 grid  gap-4'>{product.brand}
                <CardDescription className='mt-1 text-sm text-gray-500'>{product.description}</CardDescription>
                <Link href={`/product/${product.slug}`}>
                    <h2 className='text-sm font-medium'>{product.name}</h2>
                </Link>
                <div className='flex-between gap-4'><p>{product.rating} stars</p>
                    {product.stock > 0 ? (<ProductPrice value={Number(product.price)} className='text-red-500'/>) : (
                        <p className='text-destructive'>Out of stock</p>)}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;