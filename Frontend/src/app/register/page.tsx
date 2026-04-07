"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FiMail, FiLock, FiUser, FiAtSign, FiArrowLeft } from "react-icons/fi";
import styles from "./auth.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-generate slug from name
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register(name, slug, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <Link href="/" className={styles.backLink}>
          <FiArrowLeft /> Back
        </Link>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            LinkHub
          </Link>
          <h1 className={styles.title}>Create your page</h1>
          <p className={styles.subtitle}>Set up your link-in-bio in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          <Input
            label="Display Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            icon={<FiUser />}
            required
          />

          <Input
            label="Your URL"
            type="text"
            placeholder="john-doe"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            icon={<FiAtSign />}
            hint={slug ? `linkhub.app/${slug}` : "Choose your unique URL"}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<FiMail />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<FiLock />}
            minLength={8}
            required
          />

          <Button type="submit" isLoading={isLoading} size="lg" className={styles.submitBtn}>
            Create Account
          </Button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link href="/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>

      <div className={styles.decorSide}>
        <div className={styles.decorContent}>
          <h2 className={styles.decorTitle}>Stand out<br />from the crowd.</h2>
          <p className={styles.decorText}>
            Choose from stunning themes, track your analytics, and make your link page truly yours.
          </p>
          <div className={styles.decorDots} />
        </div>
      </div>
    </div>
  );
}
