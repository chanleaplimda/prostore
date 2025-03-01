'use client'
import React, {useActionState} from 'react';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {signUpDefaultValues} from "@/lib/constant";
import {Button} from '@/components/ui/button';
import Link from "next/link";
import {signUpUser} from "@/lib/action/user.action";
import {useFormStatus} from "react-dom";
import {useSearchParams} from "next/navigation";
import {Eye, EyeOff} from "lucide-react";

const SignUpForm = () => {
    const [data, action] = useActionState(signUpUser, {
        success: false,
        message: ''
    })

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const [isShowPassword, setIsShowPassword] = React.useState(false);

    const [isShowConfirmPassword, setIsShowConfirmPassword] = React.useState(false);

    const SignUpButton = () => {
        const {pending} = useFormStatus();
        return (
            <Button type="submit" className='w-full' variant="default" disabled={pending}>
                {pending ? 'Submitting...' : 'Sign Up'}
            </Button>
        )
    }


    return (
        <form action={action}>
            <input type="hidden" name="callbackUrl" value={callbackUrl}/>
            <div className='space-y-6'>
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input type="name" name="name" id="name" autoComplete="name" required
                           defaultValue={signUpDefaultValues.email}/>
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" name="email" id="email" autoComplete="email" required
                           defaultValue={signUpDefaultValues.email}/>
                </div>
                <div className='relative'>
                    <Label htmlFor="password">Password</Label>
                    <div className='relative'>
                        <Input type={isShowPassword ? "text" : "password"} name="password" id="password"
                               autoComplete="password" required
                               defaultValue={signUpDefaultValues.password}/>
                        {/* Icon toggle button */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-1/2 -translate-y-1/2 h-full"
                            onClick={() => setIsShowPassword(!isShowPassword)}
                        >
                            {isShowPassword ? (
                                <Eye/>
                            ) : (
                                <EyeOff/>
                            )}
                        </Button>
                    </div>
                </div>
                <div className='relative'>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className='relative'>
                        <Input type={isShowConfirmPassword ? "text" : "password"} name="confirmPassword"
                               id="confirmPassword"
                               autoComplete="confirmPassword" required
                               defaultValue={signUpDefaultValues.confirmPassword}/>
                        <Button
                            type="button"
                            variant='ghost'
                            size='icon'
                            className='absolute right-0 top-1/2 -translate-y-1/2 h-full'
                            onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                        > {
                            isShowConfirmPassword ? (
                                    <Eye/>
                                ) :
                                (
                                    <EyeOff/>
                                )}
                        </Button>
                    </div>
                </div>
                <div className='w-full'>
                    <SignUpButton/>
                </div>
                {data && !data.success && <div className='text-sm text-center text-destructive'>{data.message}</div>}
                <div className='text-sm text-center text-muted-foreground'>
                    Already have an account?{' '}
                    <Link href='/sign-in' target='_self' className='link'>
                        Sign In
                    </Link>
                </div>
            </div>
        </form>
    );
};

export default SignUpForm;