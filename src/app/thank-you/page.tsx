"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const overtime = searchParams.get("overtime") === "true";
  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#dcebf3",
        color: "#10283d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily:
          "'Satoshi', 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "650px",
          height: "650px",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(18, 69, 89, 0.08) 0%, rgba(18, 69, 89, 0) 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          padding: "16px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "40px 32px",
            boxShadow: "0 8px 40px rgba(18, 69, 89, 0.08)",
            border: "1px solid rgba(18, 69, 89, 0.12)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>
            
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "40px",
              lineHeight: 1.2,
              fontWeight: 700,
              color: "#10283d",
            }}
          >
            Thank You!
          </h1>

          <p
            style={{
              marginTop: "20px",
              marginBottom: 0,
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#38566c",
            }}
          >
            {overtime ? "Your interview has been automatically submitted as the time limit has been exceeded." : "Your interview has been submitted successfully."}
          </p>

          <div
            style={{
              marginTop: "28px",
              padding: "24px",
              borderRadius: "14px",
              background: "#f7fafc",
              border: "1px solid #c8d9e3",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: 1.6,
                color: "#4f7389",
              }}
            >
              Our team will review your responses and get back to you shortly.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouContent />
    </Suspense>
  );
}


