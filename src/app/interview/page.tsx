"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function InterviewConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";

  const startInterview = async () => {
    const candidateName =
      typeof name !== 'undefined' && name
        ? name
        : localStorage.getItem('candidateName') || 'Candidate';

    const candidateEmail =
      typeof email !== 'undefined' && email
        ? email
        : localStorage.getItem('candidateEmail') || 'candidate@example.com';

    try {
      const verificationPayload = new FormData();
      verificationPayload.append('name', candidateName);
      verificationPayload.append('email', candidateEmail);

      const verificationResponse = await fetch(
        'https://n8n.domingogarcia.info/webhook/c330adc3-8415-45a0-87a3-d91b4e424a3f',
        {
          method: 'POST',
          body: verificationPayload,
        }
      );

      const verificationData = await verificationResponse.json();
      const verificationResult = Array.isArray(verificationData)
        ? verificationData[0]
        : verificationData;

      console.log('Interview access verification:', verificationResult);

      const status = verificationResult?.status?.toLowerCase();

      if (status === 'exist') {
        console.log('Candidate verified. Requesting Anam Session Id from n8n...');

        const sessionResponse = await fetch(
          'https://n8n.domingogarcia.info/webhook/a2c472d6-341f-40e7-a606-c4f681a3637a',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: candidateName,
              email: candidateEmail,
            }),
          }
        );

        if (!sessionResponse.ok) {
          console.error('Session Id webhook failed:', sessionResponse.status);
          alert('Unable to start the AI interview. Please try again.');
          return;
        }

        const sessionToken = (await sessionResponse.text()).trim();

        console.log('Anam Session Id received from n8n:', !!sessionToken);

        if (!sessionToken) {
          console.error('No Anam Session Id returned by n8n.');
          alert('Unable to start the AI interview. Please try again.');
          return;
        }

        localStorage.setItem('candidateName', candidateName);
        localStorage.setItem('candidateEmail', candidateEmail);
        localStorage.setItem('anamSessionToken', sessionToken);

        const targetUrl = `/interview/voice?name=${encodeURIComponent(candidateName)}&email=${encodeURIComponent(candidateEmail)}`;

        console.log('Candidate verified. Anam Session Id saved. Navigating to:', targetUrl);
        window.location.href = targetUrl;
        return;
      }
      if (status === 'not exist') {
        console.log('Candidate not found in database.');

        window.location.href =
          `/not-in-database?name=${encodeURIComponent(candidateName)}`;

        return;
      }

      console.error('Unexpected verification response:', verificationResult);
      alert('Unable to verify your interview access. Please try again.');
    } catch (error) {
      console.error('Interview verification failed:', error);
      alert('Unable to verify your interview access. Please try again.');
    }
  };
  const goBack = () => {
    router.push("/");
  };

  return (
    <div style={styles.page}>
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />

      <div style={styles.mainContainer}>
        <div style={styles.card}>
          <div style={styles.badge}>Interview Confirmation</div>

          <h1 style={styles.title}>You're Ready For Your Interview.</h1>

          <p style={styles.subtitle}>
            Please review your information before starting.
          </p>

          <div style={styles.infoSection}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Candidate</span>
              <span style={styles.infoValue}>{name || "Not provided"}</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Email</span>
              <span style={styles.infoValue}>{email || "Not provided"}</span>
            </div>
          </div>

          {/* BLUE INSTRUCTION BOX WITH VISIBLE BULLETS */}
          <div style={styles.rulesBox}>
            <h2 style={styles.rulesTitle}>Before you begin</h2>

            <div style={styles.rulesList}>
              <div style={styles.ruleItem}>
                <span style={styles.bullet}>•</span>
                <span style={styles.ruleText}>
                  You have <strong style={styles.highlight}>10 minutes</strong> to complete all questions.
                </span>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.bullet}>•</span>
                <span style={styles.ruleText}>
                  Make sure you use a laptop or PC for the best interview experience.
                </span>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.bullet}>•</span>
                <span style={styles.ruleText}>
                  Ensure your microphone and camera are connected and working properly.
                </span>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.bullet}>•</span>
                <span style={styles.ruleText}>
                  Ensure you have a stable internet connection before starting.
                </span>
              </div>
              <div style={styles.ruleItem}>
                <span style={styles.bullet}>•</span>
                <span style={styles.ruleText}>
                  Prepare to speak naturally as in a real interview—your AI coach will tailor questions and evaluate your answers live.
                </span>
              </div>
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button
              onClick={goBack}
              style={styles.backButton}
            >
              Back to Edit
            </button>

            <button
              onClick={startInterview}
              style={styles.startButton}
            >
              Start Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InterviewConfirmation() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>Loading...</div>}>
      <InterviewConfirmationContent />
    </Suspense>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #dcebf3 0%, #eef5f8 48%, #d8e9f1 100%)",
    color: "#10283d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  glowOne: {
    position: "absolute",
    width: "600px",
    height: "600px",
    left: "-180px",
    bottom: "-260px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(90, 168, 196, 0.20) 0%, rgba(90, 168, 196, 0) 70%)",
    pointerEvents: "none",
  },

  glowTwo: {
    position: "absolute",
    width: "700px",
    height: "700px",
    right: "-300px",
    top: "-330px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0) 70%)",
    pointerEvents: "none",
  },

  mainContainer: {
    width: "100%",
    maxWidth: "620px",
    padding: "16px 24px",
    position: "relative",
    zIndex: 2,
  },

  card: {
    background: "rgba(255, 255, 255, 0.96)",
    border: "1px solid rgba(39, 110, 133, 0.12)",
    borderRadius: "24px",
    padding: "26px 32px 22px",
    boxShadow: "0 25px 70px rgba(34, 85, 105, 0.14), 0 5px 20px rgba(34, 85, 105, 0.07)",
  },

  badge: {
    display: "inline-block",
    padding: "6px 16px",
    borderRadius: "100px",
    background: "#176f83",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 650,
    letterSpacing: "-0.2px",
    marginBottom: "16px",
  },

  title: {
    fontSize: "28px",
    fontWeight: 750,
    color: "#142d47",
    lineHeight: "1.2",
    letterSpacing: "-0.7px",
    margin: "0 0 8px 0",
  },

  subtitle: {
    fontSize: "16px",
    color: "#4f7389",
    margin: "0 0 16px 0",
  },

  infoSection: {
    background: "#f7fafc",
    borderRadius: "12px",
    padding: "11px 18px",
    marginBottom: "14px",
    border: "1px solid #c8d9e3",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
  },

  infoLabel: {
    color: "#8195a8",
    fontSize: "15px",
    fontWeight: 500,
  },

  infoValue: {
    color: "#152d43",
    fontSize: "15px",
    fontWeight: 700,
  },

  rulesBox: {
    background: "#e8f2f6",
    borderRadius: "16px",
    padding: "14px 20px",
    marginBottom: "18px",
    border: "1px solid rgba(23, 111, 131, 0.15)",
  },

  rulesTitle: {
    fontSize: "17px",
    fontWeight: 700,
    color: "#142d47",
    margin: "0 0 8px 0",
  },

  rulesList: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  ruleItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "7px",
  },

  bullet: {
    color: "#176f83",
    fontWeight: 700,
    fontSize: "18px",
    lineHeight: "1.2",
    flexShrink: 0,
  },

  ruleText: {
    color: "#38566c",
    fontSize: "14.5px",
    lineHeight: "1.5",
    fontWeight: 400,
  },

  highlight: {
    color: "#142d47",
    fontWeight: 700,
  },

  buttonGroup: {
    display: "flex",
    gap: "14px",
  },

  backButton: {
    flex: 1,
    height: "50px",
    background: "#f7fafc",
    color: "#176f83",
    border: "1px solid #c8d9e3",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 650,
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },

  startButton: {
    flex: 2,
    height: "50px",
    background: "linear-gradient(135deg, #176f83 0%, #207f96 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 8px 22px rgba(22, 111, 131, 0.22)",
    fontFamily: "inherit",
  },
};










