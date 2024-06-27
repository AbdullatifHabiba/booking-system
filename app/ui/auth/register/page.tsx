import Navbar from '../../components/Navbar';

export default function SignUp() {
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center">
        <form className="bg-white p-6 rounded shadow-md w-80">
          <h2 className="text-2xl mb-4">Sign Up</h2>
          <input type="text" placeholder="Username" className="w-full p-2 mb-4 border rounded" />
          <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" />
          <input type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" />
          <button className="bg-blue-600 text-white w-full p-2 rounded">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
