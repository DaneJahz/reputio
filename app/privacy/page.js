export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-16 font-sans">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: May 6, 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
        <p className="text-gray-600 leading-relaxed">OwnerReply collects information you provide when creating an account, including your name and email address. When you connect your Google Business Profile, we collect an access token to read your reviews and post responses on your behalf. We do not store your Google password.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
        <p className="text-gray-600 leading-relaxed">We use your information to provide the OwnerReply service — reading your Google reviews, generating AI-powered responses, and posting approved responses to Google on your behalf. We use your email address to send you review approval notifications.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Storage</h2>
        <p className="text-gray-600 leading-relaxed">Your data is stored securely in our database. We store your business information, review history, and response drafts. We do not sell your data to third parties.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Google API Services</h2>
        <p className="text-gray-600 leading-relaxed">OwnerReply uses Google API Services to access your Google Business Profile reviews and post responses. Our use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Third Party Services</h2>
        <p className="text-gray-600 leading-relaxed">We use Stripe for payment processing, Clerk for authentication, and Anthropic's Claude API for generating review responses. Each of these services has their own privacy policies governing their use of data.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Deletion</h2>
        <p className="text-gray-600 leading-relaxed">You may request deletion of your account and associated data at any time by emailing us at getownerreply@gmail.com. We will delete your data within 30 days of your request.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contact</h2>
        <p className="text-gray-600 leading-relaxed">If you have questions about this privacy policy, please contact us at getownerreply@gmail.com.</p>
      </section>

      <a href="/" className="text-sm text-gray-400 hover:text-gray-600">← Back to OwnerReply</a>
    </div>
  );
}