<<<<<<< Updated upstream
import { SignIn } from '@clerk/nextjs';

const page = () => {
    return <SignIn />
}

export default page
=======
'use client';

import { SignIn, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const page = () => {
    const { isSignedIn } = useUser();
    const router = useRouter();

    useEffect(() => {
        console.log('Hi');
        
        if (isSignedIn) {
            console.log('Hello');
            // window.location.href = '/dashboard';
            router.push("/dashboard");
        }
    }, [isSignedIn]);

    return <SignIn path='/sign-in' routing='path' signUpUrl='/sign-up' />;
}

export default page;
>>>>>>> Stashed changes
