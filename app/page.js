import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TonePreview from "./components/TonePreview";
import ReferralTracker from "./components/ReferralTracker";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <ReferralTracker />
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <span className="text-xl font-bold text-gray-900">OwnerReply</span>
        <div className="flex gap-4 items-center">
          <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 hidden md:block">Blog</Link>
          <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">Log in</Link>
          <Link href="/sign-up" className="text-sm bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">Start free trial</Link>
        </div>
      </nav>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center">

          {/* Hero */}
          <p className="inline-block bg-green-50 text-green-700 text-sm font-medium px-4 py-1 rounded-full mb-6">✅ Follow-Up tool live now — Google Reviews launching July 5th</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">Win more business with every message you send</h1>
          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-xl mx-auto">OwnerReply gives local business owners AI-powered tools to follow up on estimates, win back past customers, and respond to Google reviews — all in seconds.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/sign-up" className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800">Start free — 14 days free</Link>
            <Link href="#tools" className="border border-gray-200 text-gray-700 px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-50">See our tools</Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            <div className="p-6 border border-gray-100 rounded-2xl text-left">
              <p className="text-2xl font-bold text-gray-900 mb-1">10–30%</p>
              <p className="text-sm text-gray-500">Revenue contractors lose from poor follow-up</p>
            </div>
            <div className="p-6 border border-gray-100 rounded-2xl text-left">
              <p className="text-2xl font-bold text-gray-900 mb-1">60 sec</p>
              <p className="text-sm text-gray-500">To generate a ready-to-send follow-up message</p>
            </div>
            <div className="p-6 border border-gray-100 rounded-2xl text-left">
              <p className="text-2xl font-bold text-gray-900 mb-1">1-click</p>
              <p className="text-sm text-gray-500">Approve and post review replies to Google</p>
            </div>
          </div>

          {/* Tools Section */}
          <div id="tools" className="mb-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Two tools. One subscription.</h2>
            <p className="text-gray-500 mb-12 max-w-xl mx-auto">Everything a local business owner needs to communicate better with customers — and win more work.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">

              {/* Follow-Up Tool */}
              <div className="border-2 border-black rounded-2xl p-6 relative">
                <span className="absolute -top-3 left-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Available now</span>
                <div className="text-2xl mb-3">🔨</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Estimate Follow-Up & Win-Back</h3>
                <p className="text-sm text-gray-500 mb-4">Contractors lose thousands every month to unanswered estimates and forgotten past customers. OwnerReply generates a ready-to-send email, text, and voicemail script in seconds — so you never leave money on the table again.</p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Estimate follow-up messages</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Past customer win-back campaigns</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Email, text, and voicemail script</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> HVAC, plumbing, roofing, and more</li>
                </ul>
                <Link href="/sign-up" className="block w-full bg-black text-white py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 text-center">Start free trial →</Link>
              </div>

              {/* Review Reply Tool */}
              <div className="border border-gray-200 rounded-2xl p-6 relative">
                <span className="absolute -top-3 left-4 bg-amber-400 text-white text-xs font-semibold px-3 py-1 rounded-full">Launching July 5th</span>
                <div className="text-2xl mb-3">⭐</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Google Review Replies</h3>
                <p className="text-sm text-gray-500 mb-4">Never ignore a Google review again. OwnerReply monitors your Google Business Profile and drafts professional, personalized responses the moment a review comes in. You approve with one click.</p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> AI-drafted responses in seconds</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> One-click post to Google</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Hourly review monitoring</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Instant email alerts</li>
                </ul>
                <Link href="/waitlist" className="block w-full border border-gray-200 text-gray-700 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 text-center">Join the waitlist →</Link>
              </div>
            </div>
          </div>

          {/* How Follow-Up Works */}
          <div id="how-it-works" className="mb-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Stop losing jobs to silence</h2>
            <p className="text-gray-500 mb-12 max-w-xl mx-auto">Contractors lose 10–30% of potential revenue every year because they don't follow up. Here's how OwnerReply fixes that in under a minute.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div>
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">1</div>
                <h3 className="font-semibold text-gray-900 mb-2">Enter the job details</h3>
                <p className="text-sm text-gray-500">Customer name, job type, estimate amount, and how many days since you sent it.</p>
              </div>
              <div>
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">2</div>
                <h3 className="font-semibold text-gray-900 mb-2">AI writes the messages</h3>
                <p className="text-sm text-gray-500">Get a ready-to-send email, text message, and voicemail script — personalized, natural, never pushy.</p>
              </div>
              <div>
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">3</div>
                <h3 className="font-semibold text-gray-900 mb-2">Copy and send</h3>
                <p className="text-sm text-gray-500">Copy the message you want and send it however you communicate — email, text, or call.</p>
              </div>
            </div>
          </div>

          {/* Who it's for */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for the trades</h2>
            <p className="text-gray-500 mb-12 max-w-xl mx-auto">If you send estimates and deal with customers, OwnerReply was built for you.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="p-6 border border-gray-100 rounded-2xl">
                <p className="font-semibold text-gray-900 mb-2">HVAC & Plumbing</p>
                <p className="text-sm text-gray-500">Win back seasonal maintenance customers and follow up on installation estimates before they go with a competitor.</p>
              </div>
              <div className="p-6 border border-gray-100 rounded-2xl">
                <p className="font-semibold text-gray-900 mb-2">Roofing & Electrical</p>
                <p className="text-sm text-gray-500">Big-ticket estimates deserve a professional follow-up. Stop letting thousands slip away to silence.</p>
              </div>
              <div className="p-6 border border-gray-100 rounded-2xl">
                <p className="font-semibold text-gray-900 mb-2">Landscaping & Cleaning</p>
                <p className="text-sm text-gray-500">Re-engage past customers at the start of each season before they book someone else.</p>
              </div>
              <div className="p-6 border border-gray-100 rounded-2xl">
                <p className="font-semibold text-gray-900 mb-2">General Contractors</p>
                <p className="text-sm text-gray-500">Turn your quote history into a sales pipeline. Every unanswered estimate is money waiting to be recovered.</p>
              </div>
            </div>
          </div>

          {/* AI in action */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">See the AI in action</h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">Here's a real example of a Google review response. Choose your tone:</p>
            <TonePreview />
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12 mb-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, honest pricing</h2>
            <p className="text-gray-500 mb-8">One plan. Both tools. No contracts.</p>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-sm mx-auto">
              <p className="text-4xl font-bold text-gray-900 mb-1">$39<span className="text-lg font-normal text-gray-500">/mo</span></p>
              <p className="text-gray-500 text-sm mb-6">per location — includes all tools</p>
              <ul className="text-sm text-gray-600 space-y-3 mb-6 text-left">
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✓</span> Estimate follow-up message generator</li>
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✓</span> Past customer win-back messages</li>
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✓</span> Email, text, and voicemail scripts</li>
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✓</span> Google review replies (July 5th)</li>
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✓</span> One-click post to Google</li>
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✓</span> Instant email alerts for new reviews</li>
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✓</span> Powered by Claude AI</li>
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✓</span> 14-day free trial — no credit card required</li>
                <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✓</span> Cancel anytime</li>
              </ul>
              <div className="border-t border-gray-100 pt-4 mb-6">
                <p className="text-xs text-gray-400 text-center">🚀 More tools coming soon</p>
              </div>
              <Link href="/sign-up" className="block w-full bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-800 text-center">Start free trial</Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-24 text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Do I need a credit card to start?",
                  a: "No. Your 14-day free trial starts the moment you sign up. No credit card required until you decide to subscribe."
                },
                {
                  q: "What does the Follow-Up tool actually generate?",
                  a: "For each follow-up, you get three ready-to-send messages: a professional email (with subject line), a text message under 160 characters, and a natural voicemail script. All three are personalized to the customer, job type, estimate amount, and tone you select."
                },
                {
                  q: "When does the Google Review tool launch?",
                  a: "July 5th, 2026. It's included in your subscription at no extra cost. If you sign up now for the Follow-Up tool, you'll get access to Google Review Replies automatically when it launches."
                },
                {
                  q: "How does OwnerReply connect to my Google Business Profile?",
                  a: "You connect via Google's secure OAuth login — the same way you'd log into any Google app. We never see or store your Google password."
                },
                {
                  q: "Can I edit the messages before sending?",
                  a: "Absolutely. Every generated message is fully editable. You copy it and send it however you communicate — nothing is sent automatically without your approval."
                },
                {
                  q: "What trades does the Follow-Up tool work for?",
                  a: "HVAC, Plumbing, Electrical, Roofing, Landscaping, Painting, General Contracting, Cleaning, and more. If you send estimates and deal with customers, it works for you."
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Yes. Cancel anytime from your dashboard with no fees or penalties. Your subscription continues until the end of the billing period."
                },
                {
                  q: "Does it work for multiple locations?",
                  a: "Each location requires its own subscription at $39/mo. Multi-location management is on our roadmap."
                },
              ].map((item, i) => (
                <div key={i} className="border border-gray-100 rounded-2xl p-6">
                  <p className="font-semibold text-gray-900 mb-2">{item.q}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-black rounded-3xl p-8 md:p-12 text-center text-white mb-8">
            <h2 className="text-3xl font-bold mb-4">Start winning back lost revenue today</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Join local business owners using OwnerReply to follow up faster, win more jobs, and build better reputations.</p>
            <Link href="/sign-up" className="inline-block bg-white text-black px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-100">Start your free 14-day trial</Link>
          </div>

        </div>
      </main>

      <footer className="border-t border-gray-100 px-8 py-6 text-center">
        <div className="flex justify-center gap-6 text-sm text-gray-400 flex-wrap">
          <Link href="/blog" className="hover:text-gray-600">Blog</Link>
          <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
          <a href="mailto:getownerreply@gmail.com" className="hover:text-gray-600">Contact</a>
          <a href="https://www.facebook.com/profile.php?id=61589344806313" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">Facebook</a>
          <a href="https://x.com/GetOwnerReply" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">X</a>
          <a href="https://www.instagram.com/ownerreply/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">Instagram</a>
        </div>
        <p className="text-xs text-gray-300 mt-3">© 2026 OwnerReply. All rights reserved.</p>
      </footer>
    </div>
  );
}