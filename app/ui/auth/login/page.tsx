
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
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

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (response.status === 200) {
      console.log('Sign In Successful:', data);
      // show success message
    router.push('/ui/slots');
      }
      else{
        // retunr error message
        console.log('Sign In Failed:', data);
        return;
       
      }
      
      // Store the response in sessionStorage
      sessionStorage.setItem('jwt', JSON.stringify(data.token));

      // Handle successful sign-in (e.g., redirect, update UI)
    } catch (error) {
      console.error('Error during sign-in:', error);
      // Handle error (e.g., show error message to user)
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
    </div>
  );
}
