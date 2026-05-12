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
      <nav className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <span className="text-xl font-bold text-gray-900">OwnerReply</span>
        <div className="flex gap-3 items-center">
          <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 hidden md:block">Blog</Link>
          <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">Log in</Link>
          <Link href="/sign-up" className="text-sm bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 whitespace-nowrap">Start free trial</Link>
        </div>
      </nav>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-24 text-center">

          {/* Hero */}
          <p className="inline-block bg-green-50 text-green-700 text-xs md:text-sm font-medium px-4 py-1 rounded-full mb-6">✅ Second Knock — Google Reviews launching July 5th</p>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">Win more business with every message you send</h1>
          <p className="text-base md:text-xl text-gray-500 mb-8 max-w-xl mx-auto">OwnerReply gives local business owners AI-powered tools to follow up on estimates, win back past customers, and respond to Google reviews — all in seconds.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link href="/sign-up" className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800">Start free — 14 days, no card needed</Link>
            <Link href="#tools" className="border border-gray-200 text-gray-700 px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-50">See our tools</Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 mb-16 md:mb-24">
            <div className="p-4 md:p-6 border border-gray-100 rounded-2xl text-left">
              <p className="text-xl md:text-2xl font-bold text-gray-900 mb-1">10–30%</p>
              <p className="text-xs md:text-sm text-gray-500">Revenue lost from poor follow-up</p>
            </div>
            <div className="p-4 md:p-6 border border-gray-100 rounded-2xl text-left">
              <p className="text-xl md:text-2xl font-bold text-gray-900 mb-1">60 sec</p>
              <p className="text-xs md:text-sm text-gray-500">To generate a ready-to-send message</p>
            </div>
            <div className="p-4 md:p-6 border border-gray-100 rounded-2xl text-left">
              <p className="text-xl md:text-2xl font-bold text-gray-900 mb-1">1-click</p>
              <p className="text-xs md:text-sm text-gray-500">Post review replies to Google</p>
            </div>
          </div>

          {/* Tools Section */}
          <div id="tools" className="mb-16 md:mb-24">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Two tools. Pick one or get both.</h2>
            <p className="text-gray-500 mb-10 max-w-xl mx-auto text-sm md:text-base">Start with what you need most. Add the other anytime.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">

              {/* Follow-Up Tool */}
              <div className="border-2 border-black rounded-2xl p-6 relative">
                <span className="absolute -top-3 left-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Available now — $29/mo</span>
                <div className="text-2xl mb-3">🔨</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Second Knock</h3>
                <p className="text-sm text-gray-500 mb-4">Stop losing jobs to silence. Generate a ready-to-send email, text, and voicemail script for any estimate or past customer — in seconds.</p>
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
                <span className="absolute -top-3 left-4 bg-amber-400 text-white text-xs font-semibold px-3 py-1 rounded-full">Launching July 5th — $35/mo</span>
                <div className="text-2xl mb-3">⭐</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Google Review Replies</h3>
                <p className="text-sm text-gray-500 mb-4">Never ignore a Google review again. OwnerReply monitors your profile and drafts professional responses the moment a review comes in. You approve with one click.</p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> AI-drafted responses in seconds</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> One-click post to Google</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Hourly review monitoring</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Instant email alerts</li>
                </ul>
                <Link href="/sign-up" className="block w-full border border-gray-200 text-gray-700 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 text-center">Join the waitlist →</Link>
              </div>
            </div>
          </div>

          {/* How Follow-Up Works */}
          <div id="how-it-works" className="mb-16 md:mb-24">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Stop losing jobs to silence</h2>
            <p className="text-gray-500 mb-10 max-w-xl mx-auto text-sm md:text-base">Contractors lose 10–30% of potential revenue every year because they don't follow up. Here's how OwnerReply fixes that in under a minute.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left">
              <div>
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">1</div>
                <h3 className="font-semibold text-gray-900 mb-2">Enter the job details</h3>
                <p className="text-sm text-gray-500">Customer name, job type, estimate amount, and how many days since you sent it.</p>
              </div>
              <div>
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">2</div>
                <h3 className="font-semibold text-gray-900 mb-2">AI writes the messages</h3>
                <p className="text-sm text-gray-500">Get a ready-to-send email, text, and voicemail script — personalized, natural, never pushy.</p>
              </div>
              <div>
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">3</div>
                <h3 className="font-semibold text-gray-900 mb-2">Copy and send</h3>
                <p className="text-sm text-gray-500">Copy the message and send it however you communicate — email, text, or call.</p>
              </div>
            </div>
          </div>

          {/* Who it's for */}
          <div className="mb-16 md:mb-24">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Built for the trades</h2>
            <p className="text-gray-500 mb-10 max-w-xl mx-auto text-sm md:text-base">If you send estimates and deal with customers, OwnerReply was built for you.</p>
            <div className="grid grid-cols-2 gap-4 md:gap-6 text-left">
              <div className="p-4 md:p-6 border border-gray-100 rounded-2xl">
                <p className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">HVAC & Plumbing</p>
                <p className="text-xs md:text-sm text-gray-500">Win back seasonal customers and follow up on installation estimates before they go elsewhere.</p>
              </div>
              <div className="p-4 md:p-6 border border-gray-100 rounded-2xl">
                <p className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Roofing & Electrical</p>
                <p className="text-xs md:text-sm text-gray-500">Big-ticket estimates deserve a professional follow-up. Stop letting thousands slip away.</p>
              </div>
              <div className="p-4 md:p-6 border border-gray-100 rounded-2xl">
                <p className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Landscaping & Cleaning</p>
                <p className="text-xs md:text-sm text-gray-500">Re-engage past customers at the start of each season before they book someone else.</p>
              </div>
              <div className="p-4 md:p-6 border border-gray-100 rounded-2xl">
                <p className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">General Contractors</p>
                <p className="text-xs md:text-sm text-gray-500">Turn your quote history into a pipeline. Every unanswered estimate is money waiting to be recovered.</p>
              </div>
            </div>
          </div>

          {/* AI in action */}
          <div className="mb-16 md:mb-24">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">See the AI in action</h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto text-sm md:text-base">A real example of a Google review response. Choose your tone:</p>
            <TonePreview />
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-3xl p-6 md:p-12 mb-16 md:mb-24">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Simple, honest pricing</h2>
            <p className="text-gray-500 mb-10 text-sm md:text-base">Pick the plan that fits. No contracts. Cancel anytime.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

              {/* Plan 1 */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 text-left">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Second Knock</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">$29<span className="text-base font-normal text-gray-500">/mo</span></p>
                <p className="text-xs text-gray-400 mb-5">per location</p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Estimate follow-up messages</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Customer win-back campaigns</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Email, text & voicemail scripts</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> 14-day free trial</li>
                </ul>
                <Link href="/sign-up" className="block w-full bg-black text-white py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 text-center">Start free trial</Link>
              </div>

              {/* Plan 2 */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 text-left">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Review Replies</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">$35<span className="text-base font-normal text-gray-500">/mo</span></p>
                <p className="text-xs text-gray-400 mb-5">per location</p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> AI-drafted Google responses</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> One-click post to Google</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Hourly monitoring & alerts</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> 14-day free trial</li>
                </ul>
                <Link href="/sign-up" className="block w-full bg-black text-white py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 text-center">Start free trial</Link>
              </div>

              {/* Plan 3 - Best value */}
              <div className="bg-white rounded-2xl border-2 border-green-400 p-6 text-left relative">
                <span className="absolute -top-3 left-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Best value</span>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Both Tools</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">$49<span className="text-base font-normal text-gray-500">/mo</span></p>
                <p className="text-xs text-gray-400 mb-5">per location — save $15/mo</p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Everything in both plans</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Follow-up + review replies</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> Best value for growing businesses</li>
                  <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span> 14-day free trial</li>
                </ul>
                <Link href="/sign-up" className="block w-full bg-green-500 text-white py-2.5 rounded-full text-sm font-medium hover:bg-green-600 text-center">Start free trial</Link>
              </div>

            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16 md:mb-24 text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Do I need a credit card to start?",
                  a: "No. Your 14-day free trial starts the moment you sign up. No credit card required until you decide to subscribe."
                },
                {
                  q: "What's the difference between the plans?",
                  a: "Second Knock ($29/mo) gives you the Follow-Up Message generator — estimate follow-ups, customer win-backs, and voicemail scripts. The Review Replies plan ($35/mo) gives you AI-powered Google review responses. The Both Tools plan ($49/mo) includes everything and saves you $15/mo compared to buying separately."
                },
                {
                  q: "What does the Follow-Up tool actually generate?",
                  a: "For each follow-up, you get three ready-to-send messages: a professional email with subject line, a text message under 160 characters, and a natural voicemail script — all personalized to the customer, job type, and tone you select."
                },
                {
                  q: "When does the Google Review tool launch?",
                  a: "July 5th, 2026. If you sign up for the Review Replies or Both Tools plan now, you'll get access automatically when it launches."
                },
                {
                  q: "Can I switch plans later?",
                  a: "Yes. You can upgrade or change your plan at any time from your account dashboard."
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
                  a: "Each location requires its own subscription. Multi-location management is on our roadmap."
                },
              ].map((item, i) => (
                <div key={i} className="border border-gray-100 rounded-2xl p-5 md:p-6">
                  <p className="font-semibold text-gray-900 mb-2 text-sm md:text-base">{item.q}</p>
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-black rounded-3xl p-8 md:p-12 text-center text-white mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Start winning back lost revenue today</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm md:text-base">Join local business owners using OwnerReply to follow up faster, win more jobs, and build better reputations.</p>
            <Link href="/sign-up" className="inline-block bg-white text-black px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-100">Start your free 14-day trial</Link>
          </div>

        </div>
      </main>

      <footer className="border-t border-gray-100 px-6 py-6 text-center">
        <div className="flex justify-center gap-4 md:gap-6 text-sm text-gray-400 flex-wrap">
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