import Link from "next/link";
import styles from "./landing.module.css";

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <span>⚡</span> LinkHub
        </Link>
        <div className={styles.navLinks}>
          <Link href="/login" className={styles.navLink}>Sign In</Link>
          <Link href="/register" className={styles.navCta}>Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          🚀 The modern link-in-bio platform
        </div>
        <h1 className={styles.heroTitle}>
          Your links,<br />
          <span className={styles.heroGradient}>your brand.</span>
        </h1>
        <p className={styles.heroDescription}>
          Create a stunning, customizable link page in seconds.
          Drag-and-drop your links, choose from beautiful themes, and
          track every click with real-time analytics.
        </p>
        <div className={styles.heroCtas}>
          <Link href="/register" className={styles.ctaPrimary}>
            Create Your Page — Free
          </Link>
          <Link href="/site/prajwal" className={styles.ctaSecondary}>
            See a Live Example →
          </Link>
        </div>

        {/* Decorative preview cards */}
        <div className={styles.previewContainer}>
          <div className={styles.previewCard} style={{ background: "#0a0a0a", color: "#e0e0e0" }}>
            <div className={styles.previewAvatar} style={{ background: "#00f5d4" }}>NB</div>
            <div className={styles.previewName}>NeonByte</div>
            <div className={styles.previewLink} style={{ background: "#00f5d4", color: "#0a0a0a" }}>Twitch Stream</div>
            <div className={styles.previewLink} style={{ border: "1.5px solid #00f5d4", color: "#00f5d4", background: "transparent" }}>YouTube</div>
          </div>
          <div className={`${styles.previewCard} ${styles.previewCardCenter}`} style={{ background: "#ffffff", color: "#1a1a2e" }}>
            <div className={styles.previewAvatar} style={{ background: "#6366f1" }}>PS</div>
            <div className={styles.previewName}>Prajwal S.</div>
            <div className={styles.previewLink} style={{ background: "#1a1a2e", color: "#fff" }}>Portfolio</div>
            <div className={styles.previewLink} style={{ background: "#1a1a2e", color: "#fff" }}>GitHub</div>
            <div className={styles.previewLink} style={{ background: "#1a1a2e", color: "#fff" }}>Blog</div>
          </div>
          <div className={styles.previewCard} style={{ background: "#2d1b69", color: "#ffffff" }}>
            <div className={styles.previewAvatar} style={{ background: "#ff6b6b" }}>LC</div>
            <div className={styles.previewName}>Luna Studio</div>
            <div className={styles.previewLink} style={{ background: "#ff6b6b", color: "#fff", borderRadius: "999px" }}>Our Work</div>
            <div className={styles.previewLink} style={{ background: "#feca57", color: "#2d1b69", borderRadius: "999px" }}>Book a Call</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>Everything you need</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎨</div>
            <h3>Beautiful Themes</h3>
            <p>Choose from preset themes or fully customize colors, fonts, and button styles.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔀</div>
            <h3>Drag & Drop</h3>
            <p>Reorder your links with intuitive drag-and-drop. Changes save instantly.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Analytics</h3>
            <p>Track clicks, see traffic sources, and identify your top-performing links.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3>Secure</h3>
            <p>Row-level security ensures your data is completely isolated from other tenants.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📱</div>
            <h3>Mobile First</h3>
            <p>Optimized for mobile — where 80% of your visitors come from.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Fast</h3>
            <p>Server-rendered profile pages for instant loading and great SEO.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>Built with ❤️ by Prajwal Saggurthi</p>
      </footer>
    </div>
  );
}
