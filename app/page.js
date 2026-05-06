import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <span className="text-xl font-bold text-gray-900">OwnerReply</span>
        <div className="flex gap-4">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Log in</Link>
          <Link href="/register" className="text-sm bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">Start free trial</Link>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-8 py-24 text-center">
        <p className="inline-block bg-green-50 text-green-700 text-sm font-medium px-4 py-1 rounded-full mb-6">14-day free trial — no credit card required</p>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">AI-powered responses to every Google review</h1>
        <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">OwnerReply drafts professional replies to your reviews automatically. You approve with one click. Never ignore a review again.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800">Start free trial</Link>
          <Link href="#how-it-works" className="border border-gray-200 text-gray-700 px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-50">See how it works</Link>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-8 text-left">
          <div className="p-6 border border-gray-100 rounded-2xl">
            <p className="text-2xl font-bold text-gray-900 mb-1">60 sec</p>
            <p className="text-sm text-gray-500">Average time to respond to a review</p>
          </div>
          <div className="p-6 border border-gray-100 rounded-2xl">
            <p className="text-2xl font-bold text-gray-900 mb-1">$59/mo</p>
            <p className="text-sm text-gray-500">Flat monthly price, no surprises</p>
          </div>
          <div className="p-6 border border-gray-100 rounded-2xl">
            <p className="text-2xl font-bold text-gray-900 mb-1">6x cheaper</p>
            <p className="text-sm text-gray-500">Than Podium or Birdeye</p>
          </div>
        </div>
      </main>
    </div>
  );
}