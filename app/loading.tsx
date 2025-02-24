import React from 'react';
import Image from 'next/image';
import loader from '@/assets/loader.gif';

const Loading = () => {
    return (
        <div className="flex flex-center items-center content-center h-screen w-screen">
            <Image src={loader} height={150} width={150} alt="Loading..."></Image>
        </div>
    );
};

export default Loading;