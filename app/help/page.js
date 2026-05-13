import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "Help Center — OwnerReply",
  description: "Everything you need to know about using OwnerReply and Second Knock.",
};

export default async function HelpPage() {
  const { userId } = await auth();

  const sections = [
    { id: "getting-started", label: "Getting Started" },
    { id: "second-knock-estimate", label: "Second Knock — Estimate Follow-Up" },
    { id: "second-knock-winback", label: "Second Knock — Customer Win-Back" },
    { id: "google-reviews", label: "Google Review Replies" },
    { id: "billing", label: "Billing & Plans" },
    { id: "account", label: "Account & Settings" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <nav className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <Link href="/" className="text-xl font-bold text-gray-900">OwnerReply</Link>
        <div className="flex gap-4 items-center">
          {userId ? (
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Back to dashboard</Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">Log in</Link>
              <Link href="/sign-up" className="text-sm bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">Start free trial</Link>
            </>
          )}
        </div>
      </nav>

      <main className="flex-1 max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20 w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Help Center</h1>
        <p className="text-gray-500 mb-10 text-base">Everything you need to know about using OwnerReply and Second Knock.</p>

        {/* Table of Contents */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-14">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Table of Contents</p>
          <ol className="space-y-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-black transition-all group">
                  <span className="w-6 h-6 rounded-full bg-gray-200 group-hover:bg-black group-hover:text-white text-gray-500 text-xs flex items-center justify-center font-medium transition-all">
                    {i + 1}
                  </span>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Section 1 — Getting Started */}
        <section id="getting-started" className="mb-16 scroll-mt-8">
          <div className="bg-gray-900 rounded-xl px-6 py-4 mb-6">
            <h2 className="text-lg font-bold text-white">1. Getting Started</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Creating your account</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Go to <Link href="/sign-up" className="underline text-gray-900">getownerreply.com/sign-up</Link> and enter your email address. You'll receive a verification email — click the link to confirm your account. No credit card is required to get started.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Starting your free trial</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Your 14-day free trial begins the moment you create your account. You get full access to Second Knock immediately. Google Review Replies will be available when it launches on July 5th, 2026.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Navigating the dashboard</h3>
              <p className="text-sm text-gray-600 leading-relaxed">After signing in you'll land on your dashboard. At the top you'll see two tool cards — <strong>Review Replies</strong> and <strong>Second Knock</strong>. Click Second Knock to start generating follow-up messages. The nav bar gives you access to History, Templates, Settings, and your account.</p>
            </div>
          </div>
        </section>

        {/* Section 2 — Second Knock Estimate */}
        <section id="second-knock-estimate" className="mb-16 scroll-mt-8">
          <div className="bg-gray-900 rounded-xl px-6 py-4 mb-6">
            <h2 className="text-lg font-bold text-white">2. Second Knock — Estimate Follow-Up</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How it works</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Second Knock generates three ready-to-send messages for any estimate that's gone quiet — a professional email with subject line, a text message under 160 characters, and a voicemail script. All three are personalized to the customer and the job.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What each field means</h3>
              <div className="space-y-3">
                {[
                  { label: "Customer Name", desc: "The name of the person you sent the estimate to. Used to personalize every message." },
                  { label: "Job Type", desc: "The type of work — HVAC, Plumbing, Roofing, etc. The AI tailors the message to the specific trade." },
                  { label: "Estimate Amount", desc: "The dollar value of the estimate. Helps the AI gauge the appropriate tone and urgency." },
                  { label: "Days Since Sent", desc: "How many days ago you sent the estimate. The AI adjusts the message based on how much time has passed." },
                  { label: "Tone", desc: "Choose Friendly, Professional, or Urgent. This controls the overall voice of all three messages." },
                ].map(f => (
                  <div key={f.label} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{f.label}</p>
                    <p className="text-sm text-gray-500">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Using customer context for better messages</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">The Customer Context section is where Second Knock gets powerful. The more detail you provide, the more personalized the output.</p>
              <div className="space-y-3">
                {[
                  { label: "How did the initial conversation go?", desc: "Tell the AI whether the customer seemed interested, hesitant, or had concerns. This shapes the tone of the follow-up." },
                  { label: "What did they say or ask about?", desc: 'Enter anything specific the customer mentioned — "said they were getting 3 quotes" or "asked about financing." The AI weaves this in naturally.' },
                  { label: "Any specific concerns mentioned?", desc: 'If they raised an objection — price, timing, scope — enter it here. The AI will address it in the message without being pushy.' },
                  { label: "Add more context", desc: "Click this to expand a free-text box. Paste in emails or texts from the customer, or add any other detail that helps personalize the message." },
                ].map(f => (
                  <div key={f.label} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{f.label}</p>
                    <p className="text-sm text-gray-500">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Understanding the output</h3>
              <div className="space-y-3">
                {[
                  { label: "📧 Email", desc: "Includes a subject line and a 3–4 sentence body. Professional, personalized, with a soft call to action. Copy the full email or just the body." },
                  { label: "💬 Text Message", desc: "Under 160 characters. Direct and punchy. Ideal for customers who prefer texting over email." },
                  { label: "📞 Voicemail Script", desc: "Written to sound natural when read aloud. About 20 seconds. Sounds like a real person left it — not a sales robot." },
                ].map(f => (
                  <div key={f.label} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{f.label}</p>
                    <p className="text-sm text-gray-500">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 — Win-Back */}
        <section id="second-knock-winback" className="mb-16 scroll-mt-8">
          <div className="bg-gray-900 rounded-xl px-6 py-4 mb-6">
            <h2 className="text-lg font-bold text-white">3. Second Knock — Customer Win-Back</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How it works</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Customer Win-Back generates personalized outreach messages for past customers you haven't heard from in months. The AI references the last job, makes the message feel timely, and keeps it warm — not like a mass email.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">When to use it</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Use Win-Back for seasonal service reminders, annual checkups, when you have a new service to offer, or any time you want to reconnect with a past customer before they book someone else. Ideal timing is 3–12 months after the last job.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What each field means</h3>
              <div className="space-y-3">
                {[
                  { label: "Customer Name", desc: "The name of the past customer you're reaching out to." },
                  { label: "Last Job Type", desc: "What type of work you did for them. The AI references this naturally in the message." },
                  { label: "How Long Ago", desc: "How long it's been since you worked with them. The AI adjusts the tone — a 3-month message is different from a 2-year message." },
                  { label: "Reason to Reach Out", desc: "Seasonal maintenance, annual checkup, new service available, or general check-in. Gives the message a reason to exist beyond 'I haven't heard from you.'" },
                  { label: "How did the last job go?", desc: "Let the AI know if the job went great, had a minor issue, or was complicated. Shapes how the message references the previous work." },
                  { label: "Anything memorable about this customer?", desc: 'Details like "mentioned wanting to redo the bathroom" or "always very friendly" help the AI write something that feels personal.' },
                  { label: "Why might they need you again?", desc: 'Enter any reason they might be due for service — "seasonal maintenance due" or "they mentioned a second job." The AI uses this to make the outreach timely.' },
                ].map(f => (
                  <div key={f.label} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{f.label}</p>
                    <p className="text-sm text-gray-500">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 — Google Reviews */}
        <section id="google-reviews" className="mb-16 scroll-mt-8">
          <div className="bg-gray-900 rounded-xl px-6 py-4 mb-6">
            <h2 className="text-lg font-bold text-white">4. Google Review Replies</h2>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800 font-medium">🚀 Launching July 5th, 2026. Sign up now to get access automatically on launch day.</p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Connecting your Google Business Profile</h3>
              <p className="text-sm text-gray-600 leading-relaxed">From your dashboard, click Connect Google. You'll be taken through Google's secure OAuth login — the same way you'd sign into any Google app. We never see or store your Google password. Once connected, OwnerReply begins monitoring your reviews automatically.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How AI responses are generated</h3>
              <p className="text-sm text-gray-600 leading-relaxed">The moment a new review comes in, OwnerReply's AI reads the review content, the star rating, and your tone preference — and drafts a personalized response. It's not a template. Every response is written specifically for that review.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Approving and posting to Google</h3>
              <p className="text-sm text-gray-600 leading-relaxed">You review the AI draft in your dashboard. Edit it if you want, or approve it as-is. One click posts it directly to Google. You're always in control — nothing posts without your approval.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Tone settings</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Choose from Professional, Friendly, or Apologetic. Set your default tone in Settings and the AI will use it for every response. You can change it anytime.</p>
            </div>
          </div>
        </section>

        {/* Section 5 — Billing */}
        <section id="billing" className="mb-16 scroll-mt-8">
          <div className="bg-gray-900 rounded-xl px-6 py-4 mb-6">
            <h2 className="text-lg font-bold text-white">5. Billing & Plans</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Plan options and pricing</h3>
              <div className="space-y-3">
                {[
                  { label: "Second Knock — $29/mo", desc: "Access to the Estimate Follow-Up and Customer Win-Back tools. Email, text, and voicemail scripts for every follow-up." },
                  { label: "Google Review Replies — $35/mo", desc: "AI-drafted responses to your Google reviews. One-click post to Google. Hourly monitoring and instant email alerts. Launching July 5th." },
                  { label: "Both Tools — $49/mo", desc: "Full access to everything. Best value — saves $15/mo compared to buying separately." },
                ].map(f => (
                  <div key={f.label} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{f.label}</p>
                    <p className="text-sm text-gray-500">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Free trial details</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Every new account gets a 14-day free trial with full access to all available tools. No credit card required to start. Your trial begins the moment you create your account.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Switching plans</h3>
              <p className="text-sm text-gray-600 leading-relaxed">You can upgrade or change your plan at any time from your dashboard. Click the Manage button in the top right corner of your dashboard to access your billing settings.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Cancelling your subscription</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Cancel anytime from your dashboard with no fees or penalties. Click Manage in the top right, then follow the cancellation steps. Your subscription stays active until the end of the current billing period.</p>
            </div>
          </div>
        </section>

        {/* Section 6 — Account */}
        <section id="account" className="mb-16 scroll-mt-8">
          <div className="bg-gray-900 rounded-xl px-6 py-4 mb-6">
            <h2 className="text-lg font-bold text-white">6. Account & Settings</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Updating your business name</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Go to Settings from your dashboard nav. Enter your business name and save. The AI uses your business name to personalize review responses and follow-up messages.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Changing your response tone</h3>
              <p className="text-sm text-gray-600 leading-relaxed">In Settings, choose your default tone — Professional, Friendly, or Apologetic. This applies to your Google review responses. For Second Knock messages, you choose the tone each time you generate.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Managing your subscription</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Click Manage in the top right of your dashboard to access your subscription settings, billing history, and cancellation options through our secure billing portal.</p>
            </div>
          </div>
        </section>

        {/* Section 7 — FAQ */}
        <section id="faq" className="mb-16 scroll-mt-8">
          <div className="bg-gray-900 rounded-xl px-6 py-4 mb-6">
            <h2 className="text-lg font-bold text-white">7. FAQ</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Do I need a credit card to start?",
                a: "No. Your 14-day free trial starts immediately with no credit card required.",
              },
              {
                q: "Can I edit the messages before sending?",
                a: "Yes — always. Every generated message is fully editable. You copy it and send it yourself. Nothing is sent automatically.",
              },
              {
                q: "What trades does Second Knock work for?",
                a: "HVAC, Plumbing, Electrical, Roofing, Landscaping, Painting, General Contracting, Cleaning, and more. If you send estimates and deal with customers, it works for you.",
              },
              {
                q: "How does OwnerReply connect to Google?",
                a: "Through Google's secure OAuth login — the same way you'd log into any Google app. We never see or store your Google password.",
              },
              {
                q: "How quickly does OwnerReply respond to new reviews?",
                a: "OwnerReply checks for new reviews every hour. The moment a new review is detected, an AI draft is generated and you're notified by email.",
              },
              {
                q: "Can I use OwnerReply for multiple locations?",
                a: "Each location requires its own subscription. Multi-location management is on our roadmap.",
              },
              {
                q: "What happens to my data if I cancel?",
                a: "Cancelling your subscription triggers automatic deletion of your data from our database — reviews, responses, and your Google connection. Your data belongs to you.",
              },
              {
                q: "Still need help?",
                a: "Email us at getownerreply@gmail.com and we'll get back to you as soon as possible.",
              },
            ].map((item, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-5">
                <p className="font-semibold text-gray-900 mb-2 text-sm">{item.q}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-black rounded-2xl p-8 text-center">
          <h3 className="font-bold text-white text-xl mb-2">Still have questions?</h3>
          <p className="text-gray-400 text-sm mb-6">We're happy to help. Reach out and we'll get back to you quickly.</p>
          <a href="mailto:getownerreply@gmail.com" className="inline-block bg-white text-black px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-100">Email us →</a>
        </div>
      </main>

      <footer className="border-t border-gray-100 px-6 py-6 text-center mt-12">
        <div className="flex justify-center gap-4 md:gap-6 text-sm text-gray-400 flex-wrap">
          <Link href="/blog" className="hover:text-gray-600">Blog</Link>
          <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
          <a href="mailto:getownerreply@gmail.com" className="hover:text-gray-600">Contact</a>
        </div>
        <p className="text-xs text-gray-300 mt-3">© 2026 OwnerReply. All rights reserved.</p>
      </footer>
    </div>
  );
}