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