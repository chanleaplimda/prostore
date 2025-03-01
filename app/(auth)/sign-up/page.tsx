import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from 'next/link';
import Image from "next/image";
import {APP_NAME} from "@/lib/constant";
import {redirect} from "next/navigation";
import {auth} from "@/auth";
import SignUpForm from "@/app/(auth)/sign-up/sign-up-form";

export const metadata = {
    title: 'Sign Up'
};

const SignUpPage = async (props: { searchParams: Promise<{ callBackUrl: string }> }) => {
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
                    <CardTitle className='text-center'>Create Account</CardTitle>
                    <CardDescription className='text-center'>Enter your information below to sign up</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <SignUpForm/>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignUpPage;