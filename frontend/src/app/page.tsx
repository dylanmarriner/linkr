export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-5xl font-display mb-4">Linkr</h1>
      <p className="text-lg text-gray-300 mb-8">Premium. Private. Powerful.</p>
      <a href="/dashboard" className="px-6 py-3 bg-gold text-black rounded-lg">Go to Dashboard</a>
    </main>
  );
}
