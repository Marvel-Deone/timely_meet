'use client';

import { SignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const page = () => {
    const { isSignedIn } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (isSignedIn) {
            // window.location.href = '/dashboard';
            router.push("/dashboard");
        }
    }, [isSignedIn]);

    return <SignIn path='/sign-in' routing='path' signUpUrl='/sign-up' />;
}

export default page;
