import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4">
      <ul className="flex space-x-6 container mx-auto  justify-center items-center h-16 text-white">
        <li>
          <Link href="/ui/auth/login">Sign In</Link>
        </li>
        <li>
          <Link href="/ui/auth/register">Sign Up</Link>
        </li>
        <li>
          <Link href="/ui/slots">Slots</Link>
        </li>
        <li>
          <Link href="/ui/zoom/meetings">Meetings</Link>
        </li>
        <li>
          <Link href="/ui/bookings">Bookings</Link>
        </li>
        
          <li>
            <Link href="/ui/profile">Profile</Link>
          </li>
        
       
        
      </ul>
    </nav>
  );
}
