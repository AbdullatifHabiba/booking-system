'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignIn() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      

      const data = await response.json();
      if (response.status === 200) {
        console.log('Sign In Successful:', data);
        // show success message and redirect to slots page
        toast.success('Sign In Successful');
        setTimeout(() => {
          router.push('/ui/slots');
        }
        , 3000);
      

      } else {
        // return error message
        console.log('Sign In Failed:', data);
        toast.error(data.message);
        return;
      }

      // Store the response in sessionStorage
      sessionStorage.setItem('jwt', JSON.stringify(data.token));
      sessionStorage.setItem('email', JSON.stringify(email));

      // Handle successful sign-in (e.g., redirect, update UI)
    } catch (error) {
      console.error('Error during sign-in:', error);
      toast.error('An error occurred during sign-in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">     


      <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">Sign In</h2>
        <input type="email" name="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" />
        <input type="password" name="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" />
        <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded">Sign In</button>
      </form>
      <ToastContainer />

    </div>
  );
}
