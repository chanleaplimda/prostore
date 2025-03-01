'use client'
import React, {useActionState} from 'react';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {signInDefaultValues} from "@/lib/constant";
import {Button} from '@/components/ui/button';
import Link from "next/link";
import {signInWithCredential} from "@/lib/action/user.action";
import {useFormStatus} from "react-dom";
import {useSearchParams} from "next/navigation";
import {Eye, EyeOff} from "lucide-react";

const CredentialSignInForm = () => {
    const [data, action] = useActionState(signInWithCredential, {
        success: false,
        message: ''
    })
    const [isShowPassword, setIsShowPassword] = React.useState(false);


    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const SignInButton = () => {
        const {pending} = useFormStatus();
        return (
            <Button type="submit" className='w-full' variant="default" disabled={pending}>
                {pending ? 'Signing In...' : 'Sign In'}
            </Button>
        )
    }


    return (
        <form action={action}>
            <input type="hidden" name="callbackUrl" value={callbackUrl}/>
            <div className='space-y-6'>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" name="email" id="email" autoComplete="email" required
                           defaultValue={signInDefaultValues.email}/>
                </div>
                <div className='relative'>
                    <Label htmlFor="password">Password</Label>
                    <div className='relative'>
                        <Input type={isShowPassword ? "text" : "password"} name="password" id="password"
                               autoComplete="password" required
                               defaultValue={signInDefaultValues.password}/>
                        <Button type="button" variant='ghost' size='icon'
                                className='absolute right-0 top-1/2 -translate-y-1/2 h-full'
                                onClick={() => setIsShowPassword(!isShowPassword)}>
                            {isShowPassword ? (<Eye/>) : (<EyeOff/>)}
                        </Button>
                    </div>

                </div>
                <div className='w-full'>
                    <SignInButton/>
                </div>
                {data && !data.success && <div className='text-sm text-center text-destructive'>{data.message}</div>}
                <div className='text-sm text-center text-muted-foreground'>
                    Don&apos;t have an account?{' '}
                    <Link href='/sign-up' target='_self' className='link'>
                        Sign Up
                    </Link>
                </div>
            </div>
        </form>
    );
};

export default CredentialSignInForm;