import Navbar from '../../components/Navbar';

export default function Search() {
  return (
    <div>
      <div className="min-h-screen p-6">
        <h2 className="text-2xl mb-4">Search</h2>
        <input type="text" placeholder="Search..." className="w-full p-2 mb-4 border rounded" />
        <button className="bg-blue-600 text-white p-2 rounded">Search</button>
      </div>
    </div>
  );
}
