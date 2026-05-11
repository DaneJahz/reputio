"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      document.cookie = `referral_code=${ref}; path=/; max-age=604800`; // 7 days
    }
  }, [searchParams]);

  return null;
}