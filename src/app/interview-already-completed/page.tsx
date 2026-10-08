"use client";

export default function InterviewAlreadyCompleted() {
  return (
    <main style={styles.page}>
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />

      <div style={styles.card}>
        <div style={styles.iconOuter}>
          <div style={styles.iconInner}>
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3L20 6V11C20 16.2 16.6 20.1 12 21C7.4 20.1 4 16.2 4 11V6L12 3Z" />
              <path d="M8.5 12.2L10.8 14.5L15.8 9.5" />
            </svg>
          </div>
        </div>

        <div style={styles.badge}>Application Status</div>

        <h1 style={styles.title}>
          Interview Already Completed
        </h1>

        <div style={styles.divider} />

        <p style={styles.message}>
          Thank you for your interest! You have already completed the
          interview for this application.
        </p>

        <div style={styles.infoBox}>
          <div style={styles.infoIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="5" y="10" width="14" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              <path d="M12 14V16" />
            </svg>
          </div>

          <div>
            <h2 style={styles.infoTitle}>
              Your interview has been recorded
            </h2>

            <p style={styles.infoText}>
              Our system has already received your interview response.
              No further action is required for this application.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "#dcebf3",
    color: "#10283d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    padding: "30px",
    boxSizing: "border-box",
    fontFamily:
      "'Satoshi', 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  glowOne: {
    position: "absolute",
    width: "650px",
    height: "650px",
    left: "18%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    background:
      "radial-gradient(circle, rgba(18, 69, 89, 0.13) 0%, rgba(18, 69, 89, 0) 70%)",
    pointerEvents: "none",
  },

  glowTwo: {
    position: "absolute",
    width: "500px",
    height: "500px",
    right: "-120px",
    bottom: "-160px",
    background:
      "radial-gradient(circle, rgba(13, 52, 68, 0.10) 0%, rgba(13, 52, 68, 0) 70%)",
    pointerEvents: "none",
  },

  card: {
    width: "100%",
    maxWidth: "760px",
    boxSizing: "border-box",
    background: "#ffffff",
    borderRadius: "22px",
    padding: "52px 58px 42px 58px",
    border: "1px solid rgba(18, 69, 89, 0.14)",
    boxShadow: "0 20px 70px rgba(18, 69, 89, 0.13)",
    textAlign: "center",
    position: "relative",
    zIndex: 2,
  },

  iconOuter: {
    width: "112px",
    height: "112px",
    margin: "0 auto 24px auto",
    borderRadius: "50%",
    background: "rgba(18, 69, 89, 0.06)",
    border: "2px solid rgba(18, 69, 89, 0.13)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  iconInner: {
    width: "78px",
    height: "78px",
    borderRadius: "50%",
    background: "#176f83",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 28px rgba(18, 69, 89, 0.22)",
  },

  badge: {
    display: "inline-block",
    padding: "6px 16px",
    borderRadius: "999px",
    background: "#e8f2f6",
    border: "1px solid #c8d9e3",
    color: "#176f83",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.35px",
    marginBottom: "16px",
  },

  title: {
    margin: "0",
    color: "#124559",
    fontSize: "40px",
    lineHeight: "1.12",
    letterSpacing: "-1.3px",
    fontWeight: 750,
  },

  divider: {
    width: "58px",
    height: "3px",
    borderRadius: "999px",
    background: "#176f83",
    margin: "22px auto 24px auto",
  },

  message: {
    maxWidth: "590px",
    margin: "0 auto",
    color: "#38566c",
    fontSize: "18px",
    lineHeight: "1.65",
    fontWeight: 400,
  },

  infoBox: {
    marginTop: "34px",
    padding: "22px 24px",
    borderRadius: "14px",
    background: "#f7fafc",
    border: "1px solid #c8d9e3",
    display: "flex",
    alignItems: "flex-start",
    gap: "17px",
    textAlign: "left",
  },

  infoIcon: {
    width: "48px",
    height: "48px",
    minWidth: "48px",
    borderRadius: "12px",
    background: "#176f83",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  infoTitle: {
    margin: "2px 0 5px 0",
    color: "#124559",
    fontSize: "16px",
    fontWeight: 700,
  },

  infoText: {
    margin: "0",
    color: "#4f7389",
    fontSize: "14px",
    lineHeight: "1.55",
    fontWeight: 400,
  },

  footer: {
    marginTop: "28px",
    color: "#8195a8",
    fontSize: "13px",
    lineHeight: "1.5",
  },
};
