export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Shy Bird Purchasing Calculator</h1>
        <p className="text-lg mb-8">Multi-location food purchasing management</p>
        <a 
          href="/login" 
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}