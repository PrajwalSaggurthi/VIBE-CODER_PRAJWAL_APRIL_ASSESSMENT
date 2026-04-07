"use client";

import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import styles from "./Input.module.css";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={cn(styles.group, error && styles.hasError)}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputWrapper}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={cn(styles.input, icon ? styles.withIcon : undefined, className)}
            {...props}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {hint && !error && <p className={styles.hint}>{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
