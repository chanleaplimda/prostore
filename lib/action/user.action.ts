'use server'
import {isRedirectError} from "next/dist/client/components/redirect-error";
import {signInFormSchema, signUpFormSchema} from "@/lib/validators";
import {signIn, signOut} from '@/auth';
import {hashSync} from "bcrypt-ts-edge";
import {prisma} from "@/db/prisma";
import {formatError} from "@/lib/utils";


//Sign in with the user credential
export async function signInWithCredential(prevSate: unknown, formData: FormData) {
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email'),
            password: formData.get('password')
        });
        await signIn('credentials', user);
        return {success: true, message: 'Sign in success'}
    } catch (e) {
        if (isRedirectError(e)) {
            throw e;
        }
        return {success: false, message: 'Invalid email or password'}
    }
}

//Sign out user
export async function signOutUser() {
    await signOut();
}

//Sign up user
export async function signUpUser(prevSate: unknown, formData: FormData) {
    try {
        const user = signUpFormSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        });
        const plainPassword = user.password;
        user.password = hashSync(user.password, 10);
        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
            }
        })
        await signIn('credentials',
            {
                email: user.email,
                password: plainPassword
            }
        );
        return {success: true, message: 'User register successfully'}
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return {success: false, message: formatError(error)}
    }
}

