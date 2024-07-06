'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<{ email: string } | null>(null); // Adjusted type for email

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('email');

        if (!storedEmail) {
            router.push('/ui/auth/login');
            return;
        }

        setUser({
            email: storedEmail,
        });
    }, [router]); // Added router to dependency array to fix useEffect warning

    return (
        <div className="min-h-screen p-6">
            <h2 className="text-2xl mb-4">Profile</h2>
            <ul>
                <li className="border p-4 mb-4">
                    Email: {user?.email}
                </li>
            </ul>
        </div>
    );
}
