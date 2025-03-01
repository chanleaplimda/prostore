import type {NextAuthConfig} from "next-auth";
import NextAuth from "next-auth";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {prisma} from "@/db/prisma";
import CredentialsProvider from 'next-auth/providers/credentials'
import {compareSync} from "bcrypt-ts-edge";
import {NextResponse} from "next/server";

export const config = {
    secret: process.env.NEXTAUTH_SECRET || "your-very-secure-random-string",
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24 * 30 //last 30 days
    },
    adapter: PrismaAdapter(prisma),
    providers: [CredentialsProvider({
        credentials: {
            email: {type: 'email'},
            password: {type: 'password'},
        },
        async authorize(credentials) {
            if (credentials == null) return null;
            //Find user in database
            const user = await prisma.user.findFirst({
                where: {
                    email: credentials.email as string,
                }
            });
            //check if user and user password is match
            if (user && user.password) {
                const isMatch = compareSync(credentials.password as string, user.password);
                //if password is match return user
                if (isMatch) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                }

            }
            //if user doesn't exist or password isn't match return null
            return null;
        }
    })],
    callbacks: {
        async session({session, token, trigger, user}: any) {
            //set the user id from token
            session.user.id = token.sub;
            session.user.role = token.role;
            session.user.name = token.name;
            // console.log('token', token);

            //If there an update , set the user name
            if (trigger === 'update') {
                session.user.name = user.name;
            }
            return session;
        },
        async jwt({token, user, trigger, session}: any) {
            //Assign user field to token
            if (user) {
                token.role = user.role;
                //If user has no name then use the email
                if (user.name === 'No Name') {
                    token.name = user.email!.split('@')[0];
                    //Update database to reflect the token name
                    await prisma.user.update(
                        {
                            where: {id: user.id},
                            data: {name: token.name},
                        }
                    )
                }
            }
            return token;
        },
        authorized({request, auth}: any) {
            //Check session cart id
            if (!request.cookies.get('sessionCartId')) {
                //Generate session cookie cart id
                const sessionCartId = crypto.randomUUID();
                // console.log('sessionCartId', sessionCartId);
                //Clone req header
                const newRequestHeader = new Headers(request.headers);
                //Create new response and add new header
                const response = NextResponse.next({
                    request: {
                        headers: newRequestHeader,
                    }
                });
                //set newly generated sessionCartId in the response cookie
                response.cookies.set('sessionCartId', sessionCartId);
                return response;
            } else {
                return true;
            }
        }
    }
} satisfies NextAuthConfig;

export const {handlers, auth, signIn, signOut} = NextAuth(config);



