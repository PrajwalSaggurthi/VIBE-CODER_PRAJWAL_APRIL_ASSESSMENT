import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-sans)",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "6rem", fontWeight: 900, color: "#6366f1", letterSpacing: "-0.04em", lineHeight: 1 }}>
        404
      </h1>
      <p style={{ fontSize: "1.25rem", color: "#475569", marginTop: "0.5rem", marginBottom: "2rem" }}>
        This page doesn&apos;t exist
      </p>
      <Link
        href="/"
        style={{
          padding: "0.5rem 1.5rem",
          background: "#6366f1",
          color: "white",
          borderRadius: "999px",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
