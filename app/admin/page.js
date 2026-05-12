import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import sql from "@/lib/db";

export default async function AdminPage() {
  const { userId } = await auth();
  const adminIds = ["user_3DN04mExtQRhazlDsqU3nzFMWoo", "user_3DN0r63rLgdtSK8NNtE823dKDXU"];
  
  if (!userId || !adminIds.includes(userId)) {
    redirect("/dashboard");
  }

  const businesses = await sql`
    SELECT * FROM businesses ORDER BY created_at DESC
  `;

  const waitlistEntries = await sql`
    SELECT * FROM waitlist ORDER BY created_at DESC
  `;

  const totalActive = businesses.filter(b => b.subscription_status === "active" && b.stripe_subscription_id).length;
  const totalTrialing = businesses.filter(b => b.subscription_status === "trial").length;
  const totalRevenue = totalActive * 35;

  const now = new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-gray-900">OwnerReply Admin</span>
        <div className="flex gap-4">
          <a href="/admin/blog" className="text-sm text-gray-500 hover:text-gray-900">Blog</a>
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">Back to dashboard</a>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total accounts</p>
            <p className="text-3xl font-bold text-gray-900">{businesses.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Active subscribers</p>
            <p className="text-3xl font-bold text-green-600">{totalActive}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">In trial</p>
            <p className="text-3xl font-bold text-amber-600">{totalTrialing}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Monthly revenue</p>
            <p className="text-3xl font-bold text-gray-900">${totalRevenue}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8">
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium">Business</th>
                <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium">Email</th>
                <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium">Status</th>
                <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium">Trial ends</th>
                <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium">Google</th>
                <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map(b => {
                const trialEnds = b.trial_ends_at ? new Date(b.trial_ends_at) : null;
                const trialDaysLeft = trialEnds ? Math.ceil((trialEnds - now) / (1000 * 60 * 60 * 24)) : null;
                const trialExpired = trialDaysLeft !== null && trialDaysLeft <= 0;

                return (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.business_name || b.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{b.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        b.subscription_status === "active" && b.stripe_subscription_id ? "bg-green-50 text-green-700" :
                        b.subscription_status === "active" ? "bg-blue-50 text-blue-700" :
                        b.subscription_status === "trial" ? "bg-amber-50 text-amber-700" :
                        "bg-gray-50 text-gray-500"
                      }`}>
                        {b.subscription_status === "active" && !b.stripe_subscription_id ? "admin" : b.subscription_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {b.subscription_status === "trial" && trialDaysLeft !== null ? (
                        <span className={`${trialExpired ? "text-red-500" : trialDaysLeft <= 3 ? "text-amber-600" : "text-gray-500"}`}>
                          {trialExpired ? "Expired" : `${trialDaysLeft}d left`}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        b.google_access_token ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"
                      }`}>
                        {b.google_access_token ? "Connected" : "Not connected"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(b.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
              {businesses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">No customers yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Waitlist ({waitlistEntries.length})</h2>
          </div>
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium">Email</th>
                <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium">Business</th>
                <th className="text-left px-6 py-4 text-xs text-gray-500 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {waitlistEntries.map(entry => (
                <tr key={entry.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{entry.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{entry.business_name || "—"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(entry.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {waitlistEntries.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-400 text-sm">No waitlist signups yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}