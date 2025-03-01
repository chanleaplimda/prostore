import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

//convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

//convert number with decimal places
export function convertNumberWithDecimal(num: number): string {
    const [int, decimal] = num.toString().split('.');
    return decimal ? `${int}.${decimal.padStart(2, '0')}` : `${int}.00`;
}

//Format error
export function formatError(error: any) {
    if (error.name === 'ZodError') {
        //Handle Zod Error
        const fieldErrors = Object.keys(error.errors).map(key => error.errors[key].message);
        return fieldErrors.join(', ');
    } else if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2002') {
        //Handle Prisma Error
        const field = error.meta?.target ? error.meta?.target[0] : 'Field';
        return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    } else {
        //Handle error
        return typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
    }
}

//Round to number to 2 decimal place
export function round2(value: number | string) {
    if (typeof value === "number") {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    } else if (typeof value === "string") {
        return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
    } else {
        throw new Error('Invalid type')
    }
}

const CURRENCY_FORMAT = new Intl.NumberFormat('en-US',
    {
        currency: 'USD',
        style: 'currency',
        minimumFractionDigits: 2,
    },
)
//Currency Format
export const formatCurrency = (amount: number | string | null) => {
    if (typeof amount === 'string') {
        return CURRENCY_FORMAT.format(Number(amount));
    }
    if (typeof amount === 'number') {
        return CURRENCY_FORMAT.format(Number(amount));
    } else {
        return 'NaN';
    }
}
