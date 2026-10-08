"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function NotInDatabaseContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Candidate";

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#e8f6fa] via-[#f4fbfd] to-[#e8f7f4] px-6 text-[#12324a]">
      <div className="w-full max-w-xl rounded-[28px] border border-white/80 bg-white/95 px-8 py-12 text-center shadow-[0_20px_60px_rgba(25,91,115,0.12)] sm:px-12">
        <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-[#e4f3f7]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#218da5] text-4xl text-white shadow-md">
            !
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-[#12324a] sm:text-4xl">
          Interview Access Unavailable
        </h1>

        <p className="mt-5 text-lg leading-8 text-[#648198]">
          Hi {name}, we could not verify your interview registration.
        </p>

        <div className="mt-7 rounded-2xl border border-[#d5eaf0] bg-[#eef8fa] px-6 py-5">
          <p className="font-semibold text-[#176f83]">
            You are not registered for this interview.
          </p>
          <p className="mt-2 text-sm leading-6 text-[#648198]">
            Interview access is available only to candidates who are registered
            in our system.
          </p>
        </div>

        <p className="mt-7 text-sm text-[#8198a8]">
          If you believe this is an error, please contact the interview
          administrator.
        </p>
      </div>
    </main>
  );
}

export default function NotInDatabasePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#eef8fa]">
          Loading...
        </main>
      }
    >
      <NotInDatabaseContent />
    </Suspense>
  );
}
