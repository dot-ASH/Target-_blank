"use client";

import "@/styles/main.scss";

export default function NotFound() {
  return (
    <div className="grow w-full flex flex-col justify-center items-center gap-5">
      <h2 className="text-[48px] text-[#575552]">Not Found</h2>
      <p className="text-[16px] text-[#575552]">
        Could not find requested resource
      </p>
      <a href="/" className="text-[16px] text-[#575552] underline">
        Return Home
      </a>
    </div>
  );
}
