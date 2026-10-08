"use client";

export default function AlreadyCompletedPage() {
  return (
    <main className="h-screen overflow-hidden bg-gradient-to-br from-[#e8f6fa] via-[#f4fbfd] to-[#e8f7f4] px-6 text-[#12324a]">
      <div className="mx-auto flex h-full max-w-6xl flex-col">
<div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl rounded-[28px] border border-white/80 bg-white/95 px-8 py-10 text-center shadow-[0_20px_60px_rgba(25,91,115,0.12)] sm:px-12 sm:py-12">

            <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-[#dff6f1]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#218da5] text-4xl text-white shadow-md">
                ✓
              </div>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#12324a] sm:text-4xl">
              Interview Already Completed
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-[#648198] sm:text-lg">
              You have already completed this interview.
              <br />
              We appreciate your time and effort!
            </p>

            <div className="mx-auto mt-8 h-1 w-16 rounded-full bg-[#218da5]" />

          </div>
        </div>

      </div>
    </main>
  );
}

