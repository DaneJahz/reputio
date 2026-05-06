import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-gray-900">Reputio</span>
        <UserButton afterSignOutUrl="/" />
      </nav>
      <main className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-8">Your reviews and responses will appear here.</p>
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Pending responses</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Responded this month</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Average rating</p>
            <p className="text-3xl font-bold text-gray-900">—</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <p className="text-gray-400 text-sm">No reviews yet. Connect your Google Business Profile to get started.</p>
          <button className="mt-4 bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-gray-800">Connect Google Business</button>
        </div>
      </main>
    </div>
  );
}