"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const n8nPayload = new FormData();
      n8nPayload.append("name", formData.name);
      n8nPayload.append("email", formData.email);
      if (cvFile) n8nPayload.append("cv", cvFile);

      const response = await fetch(
        "https://n8n.domingogarcia.info/webhook/fc2ff785-3d01-4e19-9b00-43283681da0d",
        {
          method: "POST",
          body: n8nPayload,
        }
      );

      const data = await response.json();
      const webhookResult = Array.isArray(data) ? data[0] : data;

      if (
        response.status === 409 ||
        webhookResult?.duplicate === true ||
        webhookResult?.status?.toLowerCase() === "duplicate"
      ) {
        router.push("/already-completed");
        return;
      }

      const airtableData = new FormData();
      airtableData.append("name", formData.name);
      airtableData.append("email", formData.email);
      if (cvFile) airtableData.append("cv", cvFile);

      const airtableResponse = await fetch("/api/airtable", {
        method: "POST",
        body: airtableData,
      });

      if (!airtableResponse.ok) {
        const airtableError = await airtableResponse.json().catch(() => ({}));
        console.warn("Airtable sync warning:", airtableError.error);
      }

      router.push(
        "/interview?name=" +
          encodeURIComponent(formData.name) +
          "&email=" +
          encodeURIComponent(formData.email)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />

      <div className="main-container" style={styles.mainContainer}>
        <section className="hero-section" style={styles.heroSection}>
          <div style={styles.brand}>
            <div style={styles.brandIcon}>
              <span>🤖</span>
            </div>
            <span>AI Interview Coach</span>
          </div>

          <h1 className="hero-title" style={styles.heroTitle}>
            Meet Your <span style={styles.accentText}>AI Coach</span>
          </h1>

          <h2 className="heroSubtitle" style={styles.heroSubtitle}>
            Walk into your interview
            <br />
            knowing every question
          </h2>

          <p style={styles.description}>
            Upload your resume to generate targeted, experience-based
            questions. Practice speaking out loud and get instant AI
            feedback to sharpen your answers before the actual interview.
          </p>

          <div style={styles.featureRow}>
            <div style={styles.feature}>
              <div style={{ ...styles.featureIcon, ...styles.blueIcon }}>
                🎯
              </div>
              <div>
                <div style={styles.featureTitle}>Targeted Questions</div>
                <div style={styles.featureText}>
                  Based on your resume and role goals
                </div>
              </div>
            </div>

            <div style={styles.feature}>
              <div style={{ ...styles.featureIcon, ...styles.greenIcon }}>
                🎙️
              </div>
              <div>
                <div style={styles.featureTitle}>Voice Practice</div>
                <div style={styles.featureText}>
                  Speak naturally and build confidence
                </div>
              </div>
            </div>

            <div style={styles.feature}>
              <div style={{ ...styles.featureIcon, ...styles.purpleIcon }}>
                💡
              </div>
              <div>
                <div style={styles.featureTitle}>Instant Feedback</div>
                <div style={styles.featureText}>
                  Get AI-powered insights to improve
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="form-card" style={styles.formCard}>
          <div style={styles.cardIcon}>📋</div>

          <h2 style={styles.formTitle}>Start Your Interview</h2>

          <p style={styles.formSubtitle}>
            Enter your details to begin the AI interview process
          </p>

          <form onSubmit={handleSubmit}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                placeholder="Enter your full name"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                placeholder="Enter your email address"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Upload Resume / CV</label>
              <label style={styles.resumePlaceholder}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                />
                <span style={styles.resumeIcon}>📄</span>
                <span>
                  {cvFile ? cvFile.name : "Upload your resume (PDF or DOCX)"}
                </span>
              </label>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              style={
  isLoading
    ? { ...styles.button, ...styles.buttonDisabled }
    : styles.button
}
            >
              <span style={styles.buttonArrow}>→</span>
              {isLoading ? "Submitting..." : "Begin AI Interview"}
            </button>
          </form>

          <div style={styles.consent}>
            <p style={styles.consentLine}>
              By proceeding, you agree to be recorded for evaluation
              purposes.
            </p>
            <p style={styles.consentLine}>
              Your data is processed securely and confidentially.
            </p>
          </div>
        </section>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            * {
              box-sizing: border-box;
            }

            html, body {
              margin: 0;
              padding: 0;
              min-height: 100%;
            }

            body {
              overflow-x: hidden;
            }

            input::placeholder {
              color: #8195a8;
              opacity: 1;
            }

            input:focus {
              border-color: #2d8ca0 !important;
              background: #ffffff !important;
              box-shadow: 0 0 0 4px rgba(45, 140, 160, 0.10);
            }

            button:not(:disabled):hover {
              transform: translateY(-1px);
              box-shadow: 0 12px 28px rgba(19, 111, 133, 0.28) !important;
            }
          `,
        }}
      />
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background:
      "linear-gradient(135deg, #dcebf3 0%, #eef5f8 48%, #d8e9f1 100%)",
    color: "#10283d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  glowOne: {
    position: "absolute",
    width: "600px",
    height: "600px",
    left: "-180px",
    bottom: "-260px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(90, 168, 196, 0.20) 0%, rgba(90, 168, 196, 0) 70%)",
    pointerEvents: "none",
  },
  glowTwo: {
    position: "absolute",
    width: "700px",
    height: "700px",
    right: "-300px",
    top: "-330px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0) 70%)",
    pointerEvents: "none",
  },
  mainContainer: {
    width: "100%",
    maxWidth: "1370px",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "80px",
    padding: "50px 72px",
    position: "relative",
    zIndex: 2,
  },
  heroSection: {
    flex: 1,
    maxWidth: "730px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "48px",
    fontSize: "22px",
    fontWeight: 700,
    color: "#183b56",
    letterSpacing: "-0.4px",
  },
  brandIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
    border: "1px solid rgba(29, 105, 130, 0.15)",
    fontSize: "22px",
    boxShadow: "0 5px 18px rgba(24, 76, 97, 0.10)",
  },
  heroTitle: {
    margin: "0 0 25px",
    fontSize: "62px",
    lineHeight: "1",
    letterSpacing: "-2.8px",
    fontWeight: 800,
    color: "#142b40",
  },
  accentText: {
    color: "#1e839a",
  },
  heroSubtitle: {
    margin: "0 0 25px",
    fontSize: "39px",
    lineHeight: "1.18",
    letterSpacing: "-1.7px",
    fontWeight: 400,
    color: "#183247",
  },
  description: {
    margin: "0",
    maxWidth: "670px",
    fontSize: "19px",
    lineHeight: "1.65",
    color: "#536d80",
    letterSpacing: "-0.15px",
  },
  featureRow: {
    display: "flex",
    gap: "35px",
    marginTop: "42px",
  },
  feature: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    flex: 1,
  },
  featureIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: "22px",
  },
  blueIcon: {
    background: "#dbe9ff",
  },
  greenIcon: {
    background: "#d9f5ee",
  },
  purpleIcon: {
    background: "#eee3ff",
  },
  featureTitle: {
    marginTop: "2px",
    fontSize: "16px",
    fontWeight: 700,
    color: "#1b3348",
  },
  featureText: {
    marginTop: "7px",
    fontSize: "13px",
    lineHeight: "1.45",
    color: "#678095",
  },
  formCard: {
    width: "560px",
    minHeight: "0",
    padding: "22px 38px 18px",
    background: "rgba(255, 255, 255, 0.96)",
    border: "1px solid rgba(39, 110, 133, 0.12)",
    borderRadius: "24px",
    boxShadow:
      "0 25px 70px rgba(34, 85, 105, 0.14), 0 5px 20px rgba(34, 85, 105, 0.07)",
    flexShrink: 0,
    position: "relative",
  },
  cardIcon: {
    textAlign: "center",
    fontSize: "26px",
    marginBottom: "4px",
  },
  formTitle: {
    margin: "0",
    textAlign: "center",
    fontSize: "30px",
    lineHeight: "1.25",
    fontWeight: 750,
    letterSpacing: "-0.7px",
    color: "#142d47",
  },
  formSubtitle: {
    margin: "7px 0 22px",
    textAlign: "center",
    fontSize: "17px",
    lineHeight: "1.4",
    color: "#4f7389",
  },
  fieldGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "9px",
    fontSize: "16px",
    lineHeight: "1.2",
    fontWeight: 650,
    color: "#1a3045",
  },
  input: {
    width: "100%",
    height: "48px",
    padding: "0 17px",
    borderRadius: "12px",
    border: "1px solid #c8d9e3",
    background: "#f7fafc",
    color: "#152d43",
    outline: "none",
    fontSize: "16px",
    fontWeight: 400,
    fontFamily: "inherit",
    transition: "all 0.2s ease",
  },
  resumePlaceholder: {
    width: "100%",
    height: "48px",
    padding: "0 17px",
    borderRadius: "12px",
    border: "1px dashed #9db8c5",
    background: "#f7fafc",
    color: "#8195a8",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "15px",
    fontWeight: 400,
    cursor: "pointer",
  },
  resumeIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#e8f1f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },
  button: {
    width: "100%",
    height: "52px",
    border: "none",
    borderRadius: "13px",
    background: "linear-gradient(135deg, #176f83 0%, #207f96 100%)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "11px",
    fontSize: "18px",
    fontWeight: 700,
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 8px 22px rgba(22, 111, 131, 0.22)",
  },
  buttonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  buttonArrow: {
    fontSize: "22px",
    lineHeight: "1",
  },
  error: {
    marginBottom: "16px",
    padding: "12px 14px",
    borderRadius: "10px",
    background: "#fff1f1",
    border: "1px solid #f3b4b4",
    color: "#a33b3b",
    fontSize: "14px",
  },
  consent: {
    marginTop: "14px",
    textAlign: "center",
  },
  consentLine: {
    margin: "3px 0",
    fontSize: "12px",
    lineHeight: "1.55",
    color: "#7890a0",
  },
};












