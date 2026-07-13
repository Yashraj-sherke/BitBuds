import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import mascotImg from "../assets/bit-mascot.png";

const AVATARS = ["🚀", "🦄", "🐙", "🦊", "🐻", "🦖", "🤖", "🦉"];
const ROLES = [
  { value: "parent", label: "Parent" },
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" },
];

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated, loading } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState("parent");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");

    try {
      if (mode === "signup") {
        const nameParts = displayName.trim().split(" ");
        const firstName = nameParts[0] || "Explorer";
        const lastName = nameParts.slice(1).join(" ") || "Bud";
        const isParent = role === "parent";

        await signup(email, password, firstName, lastName, isParent);
        toast.success("Welcome to BitBuds! Signing you in…");
      } else {
        await login(email, password);
        toast.success("Welcome back!");
      }
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const msg = err.message || "Something went wrong";
      setAuthError(msg);
      toast.error(msg);
    }
  }

  function useDemo() {
    setMode("signin");
    setEmail("demo@bitbuds.app");
    setPassword("BitBuds2026!");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 px-5 py-10 sm:py-16 flex flex-col justify-center items-center">
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <Link to="/" className="mb-8 flex items-center gap-3">
          <img src={mascotImg} alt="" width={56} height={56} className="h-14 w-auto object-contain animate-bit-float" />
          <span className="font-display text-4xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent tracking-tight">
            BitBuds
          </span>
        </Link>

        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-[32px] border border-border/70 bg-card p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] sm:p-8"
        >
          <div className="mb-1 text-xs font-bold uppercase tracking-widest text-primary" style={{ fontFamily: "Nunito, sans-serif" }}>
            Chapter 01 — Your Adventure
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {mode === "signin" ? "Welcome back, explorer" : "Create your account"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Log in to continue your coding journey."
              : "Set up your profile — takes 30 seconds."}
          </p>

          <button
            type="button"
            onClick={useDemo}
            className="mt-5 w-full rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-left text-sm transition hover:bg-primary/10"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-foreground">Try the demo account</div>
                <div className="truncate text-xs text-muted-foreground">
                  demo@bitbuds.app · BitBuds2026!
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                Fill in
              </span>
            </div>
          </button>

          {authError && (
            <div className="mt-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-2xl">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <>
                <Field label="Display name">
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    maxLength={60}
                    placeholder="Alex the Explorer"
                    className={inputCls}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Age (optional)">
                    <input
                      type="number"
                      min={4}
                      max={99}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="10"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="I am a…">
                    <select value={role} onChange={(e) => setRole(e.target.value)} className={inputCls}>
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Pick an avatar">
                  <div className="flex flex-wrap gap-2 pt-1">
                    {AVATARS.map((a) => (
                      <button
                        type="button"
                        key={a}
                        onClick={() => setAvatar(a)}
                        aria-label={`Avatar ${a}`}
                        className={`grid size-10 place-items-center rounded-2xl border text-xl transition ${
                          avatar === a
                            ? "border-primary bg-primary/10 scale-110"
                            : "border-border bg-card hover:bg-muted"
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </Field>
              </>
            )}

            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className={inputCls}
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                placeholder="At least 6 characters"
                className={inputCls}
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(91,95,239,0.7)] transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New to BitBuds?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-semibold text-primary hover:underline bg-transparent border-none cursor-pointer"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </motion.div>

        <Link to="/" className="mt-6 text-sm text-muted-foreground hover:text-foreground">
          ← Back to home
        </Link>
      </div>
    </div>
  );
};

const inputCls =
  "w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

export default Auth;
