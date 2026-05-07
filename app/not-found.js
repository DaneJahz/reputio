import Link from "next/link";

export const metadata = {
  title: '404 — Page Not Found | OwnerReply',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-6xl">💬</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-3">Page not found</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-sm">
        Sorry, we couldn't find the page you're looking for. It may have moved or never existed.
      </p>
      <Link
        href="/"
        className="bg-black text-white px-6 py-3 rounded-full text-sm hover:bg-gray-800 transition-colors"
      >
        Back to OwnerReply
      </Link>
    </div>
  );
}