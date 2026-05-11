"use client";
import { useState } from "react";

const tones = {
  professional: {
    label: "Professional",
    response: "Thank you for your kind words and for taking the time to share your experience! We're thrilled you enjoyed the food and we sincerely apologize for the longer than expected wait. We're always working to improve our service speed without compromising quality. We look forward to welcoming you back soon and making your next visit even better!"
  },
  friendly: {
    label: "Friendly",
    response: "Aw, thank you so much — this made our day! 😊 So glad you loved the food! We totally hear you on the wait and we're working hard to get that down. Can't wait to see you again — next time will be even smoother, we promise!"
  },
  apologetic: {
    label: "Apologetic",
    response: "Thank you so much for your patience and for leaving us such a generous review despite the wait. We sincerely apologize that your experience wasn't as seamless as it should have been. We take wait times seriously and are actively working to improve. It means the world that you're planning to return — we'll make sure your next visit reflects the standard you deserve."
  }
};

export default function TonePreview() {
  const [selected, setSelected] = useState("professional");

  return (
    <div className="bg-gray-50 rounded-3xl p-8 text-left max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
        <p className="text-xs text-gray-400 mb-2">Customer review:</p>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-amber-500 text-sm">★★★★☆</span>
          <span className="text-xs text-gray-500">Sarah M.</span>
        </div>
        <p className="text-sm text-gray-700">"Great food but the wait was a bit long. Will definitely come back though!"</p>
      </div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.entries(tones).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selected === key
                ? "bg-black text-white"
                : "border border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="bg-blue-50 rounded-2xl p-4">
        <p className="text-xs text-gray-400 mb-2">AI drafted response ({tones[selected].label.toLowerCase()} tone):</p>
        <p className="text-sm text-gray-700 leading-relaxed">{tones[selected].response}</p>
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">Generated instantly by Claude AI — edit anytime before posting</p>
    </div>
  );
}