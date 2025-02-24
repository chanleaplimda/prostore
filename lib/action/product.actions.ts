'use server'
import {convertToPlainObject} from "@/lib/utils";
import {LATEST_PRODUCT_LIMIT} from "../constant";
import {prisma} from "@/db/prisma";

//Get Latest Product
export async function getLatestProduct() {

    const data = await prisma.product.findMany(
        {
            take: LATEST_PRODUCT_LIMIT,
            orderBy: ({createdAt: 'desc'})
        });
    return convertToPlainObject(data);
}

//Get Product By Slug
export async function getProductBySlug(slug: string) {
    return await prisma.product.findFirst({
        where: {slug}
    })
}
