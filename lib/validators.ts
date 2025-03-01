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
export const signInFormSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

//Schema user sign up
export const signUpFormSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters')
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

//Cart schema
export const cartItemSchema = z.object({
    productId: z.string().min(3, 'Product id must be at least 3 characters'),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    qty: z.number().int().nonnegative('Quantity must be a positive number'),
    image: z.string().min(1, 'Image is required'),
    price: currency,
});

export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, 'Session cart id is required'),
    userId: z.string().optional().nullable(),
})