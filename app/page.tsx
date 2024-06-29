
// app/page.tsx

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-6 text-blue-600">Welcome to the Booking System</h1>
         <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Features of Our Booking System</h2>
          <ul className="list-disc list-inside text-left">
            <li>Book slots easily and efficiently</li>
            <li>Manage your meetings and bookings</li>
            <li>Get notified about upcoming events</li>
            <li>Search and filter available slots</li>
            <li>Integrate with Zoom for virtual meetings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
