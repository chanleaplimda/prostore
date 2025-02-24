'use server'
import {isRedirectError} from "next/dist/client/components/redirect-error";
import {signInSchema} from "@/lib/validators";
import {signIn, signOut} from '@/auth';


//Sign in with the user credential
export async function signInWithCredential(prevSate: unknown, formData: FormData) {
    try {
        const user = signInSchema.parse({
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