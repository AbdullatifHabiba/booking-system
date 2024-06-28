'use client'
import { authenticate } from '@/app/utils/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<{email:''} | null>(null);
    
    useEffect(() => {
        const jwt = sessionStorage.getItem('jwt')?.replace(/['"]+/g, '')
        console.log('jwt:', jwt);
        // get user from jwt token
        try {
        const user =authenticate(jwt);
        if (!user) {
            throw new Error('User not found in jwt');
        }
        
        setUser({
            email: user.email,
    
        })
        } catch (error){
            console.error('Error getting user from jwt:', error);
        router.push('/ui/auth/login');
        }
    }, []);
    
    return (
        <div>
        <div className="min-h-screen p-6">
            <h2 className="text-2xl mb-4">Profile</h2>
            <ul>
            <li className="border p-4 mb-4">
               Email
            </li>   
            {user && (
                <li className="border p-4 mb-4">
              {user.email}
                </li>
            )}
            </ul>
        </div>
        </div>
    );


}