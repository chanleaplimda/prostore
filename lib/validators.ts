import {z} from 'zod';
import {convertNumberWithDecimal} from "@/lib/utils";

const currency = z.string().refine((value) => /^\d+(\.\d+)?$/.test(convertNumberWithDecimal(Number(value))),
    'Price must be exactly two decimal places');

//Schema for insert products
export const insertProductSchema = z.object({
    name: z.string().min(3, 'Product name must be at least 3 characters'),
    slug: z.string().min(3, 'Product slug must be at least 3 characters'),
    category: z.string().min(3, 'Product category must be at least 3 characters'),
    brand: z.string().min(3, 'Product brand must be at least 3 characters'),
    description: z.string().min(3, 'Product description must be a string'),
    stock: z.coerce.number(),
    image: z.array(z.string()).min(1, 'Product should be at least have 1 image'),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency
});

//Schema user sign in
export const signInSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});
