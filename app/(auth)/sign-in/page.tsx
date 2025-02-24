import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from 'next/link';
import Image from "next/image";
import {APP_NAME} from "@/lib/constant";
import CredentialSignInForm from "@/app/(auth)/sign-in/credential-sign-in-form";
import {redirect} from "next/navigation";
import {auth} from "@/auth";

export const metadata = {
    title: 'Sign In'
};

const SignInPage = async (props: { searchParams: Promise<{ callBackUrl: string }> }) => {
    const {callBackUrl: callbackUrl} = await props.searchParams;
    const session = await auth();

    if (session) {
        return redirect(callbackUrl || '/');
    }
    return (
        <div className='w-full max-w-md mx-auto'>
            <Card>
                <CardHeader className='space-y-4'>
                    <Link href='/' className='flex-center'>
                        <Image src='images/logo.svg' height={100} width={100} alt={`${APP_NAME} logo`} priority={true}/>
                    </Link>
                    <CardTitle className='text-center'>Sign In</CardTitle>
                    <CardDescription className='text-center'>Sign In Your Account</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <CredentialSignInForm/>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignInPage;