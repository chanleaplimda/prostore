import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "../assets/styles/globals.css";
import {APP_DESCRIPTION, APP_NAME, APP_SERVERURL} from "@/lib/constant";
import React from "react";
import {ThemeProvider} from "next-themes";
import {Toaster} from "@/components/ui/sonner";

const inter = Inter({subsets: ['latin']});


export const metadata: Metadata = {
    title: {
        template: `%s | Prostore`,
        default: APP_NAME,
    },
    description: `${APP_DESCRIPTION}`,
    metadataBase: new URL(APP_SERVERURL)
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className}  antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute='class'
                       defaultTheme="ligth"
                       enableSystem
                       disableTransitionOnChange
        >
            {children}
            <Toaster/>
        </ThemeProvider>
        </body>
        </html>
    );
}
