import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <span className="text-xl font-bold text-gray-900">OwnerReply</span>
        <div className="flex gap-4 items-center">
          <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">Log in</Link>
          <Link href="/sign-up" className="text-sm bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">Start free trial</Link>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
          <p className="inline-block bg-green-50 text-green-700 text-sm font-medium px-4 py-1 rounded-full mb-6">14-day free trial — no credit card required</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">Never ignore a Google review again</h1>
          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-xl mx-auto">OwnerReply uses AI to draft professional responses to your Google reviews. You approve with one click. Runs on autopilot.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/sign-up" className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800">Start free — 14 days free</Link>
            <Link href="#how-it-works" className="border border-gray-200 text-gray-700 px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-50">See how it works</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            <div className="p-6 border border-gray-100 rounded-2xl text-left">
              <p className="text-2xl font-bold text-gray-900 mb-1">$59/mo</p>
              <p className="text-sm text-gray-500">vs $399/mo for Podium</p>
            </div>
            <div className="p-6 border border-gray-100 rounded-2xl text-left">
              <p className="text-2xl font-bold text-gray-900 mb-1">60 sec</p>
              <p className="text-sm text-gray-500">Average approval time</p>
            </div>
            <div className="p-6 border border-gray-100 rounded-2xl text-left">
              <p className="text-2xl font-bold text-gray-900 mb-1">1-click</p>
              <p className="text-sm text-gray-500">Approve and post to Google</p>
            </div>
          </div>
          <div id="how-it-works" className="mb-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div>
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">1</div>
                <h3 className="font-semibold text-gray-900 mb-2">Connect Google</h3>
                <p className="text-sm text-gray-500">Link your Google Business Profile in one click. Takes 30 seconds.</p>
              </div>
              <div>
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">2</div>
                <h3 className="font-semibold text-gray-900 mb-2">AI drafts responses</h3>
                <p className="text-sm text-gray-500">When a review comes in, Claude AI instantly drafts a professional, personalized response.</p>
              </div>
              <div>
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">3</div>
                <h3 className="font-semibold text-gray-900 mb-2">You approve</h3>
                <p className="text-sm text-gray-500">Review the draft and post it to Google with one click. Edit anytime before posting.</p>
              </div>
            </div>
          </div>
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for small businesses</h2>
            <p className="text-gray-500 mb-12 max-w-xl mx-auto">Podium and Birdeye charge $300-400/month for features you'll never use. OwnerReply does one thing exceptionally well — responds to your reviews.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="p-6 border border-gray-100 rounded-2xl">
                <p className="font-semibold text-gray-900 mb-2">Restaurants</p>
                <p className="text-sm text-gray-500">Turn negative reviews into recovered customers. Show potential diners you care.</p>
              </div>
              <div className="p-6 border border-gray-100 rounded-2xl">
                <p className="font-semibold text-gray-900 mb-2">Salons & Spas</p>
                <p className="text-sm text-gray-500">Every 5-star review deserves a thank you. Every complaint deserves a response.</p>
              </div>
              <div className="p-6 border border-gray-100 rounded-2xl">
                <p className="font-semibold text-gray-900 mb-2">Contractors</p>
                <p className="text-sm text-gray-500">Build trust with future customers by showing how you handle feedback.</p>
              </div>
              <div className="p-6 border border-gray-100 rounded-2xl">
                <p className="font-semibold text-gray-900 mb-2">Retail Shops</p>
                <p className="text-sm text-gray-500">Keep your Google profile active and engaging without spending hours on it.</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12 mb-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, honest pricing</h2>
            <p className="text-gray-500 mb-8">One plan. One price. No contracts.</p>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-sm mx-auto">
              <p className="text-4xl font-bold text-gray-900 mb-1">$59<span className="text-lg font-normal text-gray-500">/mo</span></p>
              <p className="text-gray-500 text-sm mb-6">per location</p>
              <ul className="text-sm text-gray-600 space-y-3 mb-8 text-left">
                <li>✓ Unlimited Google review responses</li>
                <li>✓ AI-drafted responses via Claude</li>
                <li>✓ One-click approve and post</li>
                <li>✓ 14-day free trial</li>
                <li>✓ Cancel anytime</li>
              </ul>
              <Link href="/sign-up" className="block w-full bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-800 text-center">Start free trial</Link>
            </div>
          </div>
          <div className="mb-24 text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Do I need a credit card to start?",
                  a: "No. Your 14-day free trial starts the moment you sign up. No credit card required until you decide to subscribe."
                },
                {
                  q: "Can I edit the AI response before posting?",
                  a: "Absolutely. Every AI-drafted response is fully editable before it goes live on Google. You're always in control of what gets posted."
                },
                {
                  q: "How does OwnerReply connect to my Google Business Profile?",
                  a: "You connect via Google's secure OAuth login — the same way you'd log into any Google app. We never see or store your Google password."
                },
                {
                  q: "How quickly does OwnerReply respond to new reviews?",
                  a: "OwnerReply checks for new reviews every hour. As soon as a new review is detected, an AI draft is generated and you're notified by email."
                },
                {
                  q: "What tone does the AI use?",
                  a: "You choose — professional, friendly, or apologetic. You can change your tone preference anytime in your settings."
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Yes. Cancel anytime from your dashboard with no fees or penalties. Your subscription continues until the end of the billing period."
                },
                {
                  q: "Does it work for multiple locations?",
                  a: "Each location requires its own subscription at $59/mo. Multi-location management is on our roadmap."
                },
                {
                  q: "What if I already replied to some reviews on Google?",
                  a: "No problem. OwnerReply only shows reviews that haven't been responded to yet. Already-answered reviews are displayed separately."
                },
              ].map((item, i) => (
                <div key={i} className="border border-gray-100 rounded-2xl p-6">
                  <p className="font-semibold text-gray-900 mb-2">{item.q}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-black rounded-3xl p-8 md:p-12 text-center text-white mb-8">
            <h2 className="text-3xl font-bold mb-4">Ready to stop ignoring reviews?</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Join small business owners who are building better reputations with OwnerReply.</p>
            <Link href="/sign-up" className="inline-block bg-white text-black px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-100">Start your free 14-day trial</Link>
          </div>
        </div>
      </main>
      <footer className="border-t border-gray-100 px-8 py-6 text-center">
        <div className="flex justify-center gap-6 text-sm text-gray-400">
          <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
          <a href="mailto:getownerreply@gmail.com" className="hover:text-gray-600">Contact</a>
        </div>
        <p className="text-xs text-gray-300 mt-3">© 2026 OwnerReply. All rights reserved.</p>
      </footer>
    </div>
  );
}