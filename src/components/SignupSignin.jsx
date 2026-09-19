import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

import { auth, db, provider } from "../firebase";
import Button from "./Common/Button";
import Input from "./Common/Input";

export default function SignupSignin({ initialLogin = false }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(initialLogin);
  const navigate = useNavigate();

  async function createDoc(user) {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      try {
        await setDoc(userRef, {
          name: user.displayName || name || "User",
          email: user.email,
          photoURL: user.photoURL || "",
          createdAt: new Date(),
        });
      } catch (error) {
        console.error("Error creating user doc:", error);
      }
    }
  }

  async function signupWithEmail(e) {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    toast.loading("Creating account...");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createDoc(userCredential.user);
      toast.dismiss();
      toast.success("Account created successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/app");
    } catch (error) {
      toast.dismiss();
      toast.error(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  async function loginUsingEmail(e) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in email and password");
      return;
    }

    setLoading(true);
    toast.loading("Logging in...");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.dismiss();
      toast.success("Logged in successfully!");
      setEmail("");
      setPassword("");
      navigate("/app");
    } catch {
      toast.dismiss();
      toast.error("Email or password is incorrect");
    } finally {
      setLoading(false);
    }
  }

  async function googleAuth(e) {
    e.preventDefault();
    setLoading(true);
    toast.loading("Authenticating with Google...");

    try {
      const result = await signInWithPopup(auth, provider);
      await createDoc(result.user);
      toast.dismiss();
      toast.success("Authenticated successfully!");
      navigate("/app");
    } catch (error) {
      toast.dismiss();
      toast.error(error.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full text-neutral-900 dark:text-neutral-50">
      {/* Form Header */}
      <div className="text-center space-y-1 mb-4">
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {loginForm ? "Welcome back" : "Create an account"}
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {loginForm
            ? "Login to your Spendzy account"
            : "Take control of your money with Spendzy"}
        </p>
      </div>

      {loginForm ? (
        /* ──────────── LOGIN FORM ──────────── */
        <form onSubmit={loginUsingEmail} className="space-y-2.5">
          <Input
            type="email"
            label="Email"
            placeholder="name@example.com"
            state={email}
            setState={setEmail}
          />

          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            state={password}
            setState={setPassword}
          />

          <div className="pt-1">
            <Button
              type="submit"
              onClick={loginUsingEmail}
              disabled={loading}
              text={loading ? "Logging in..." : "Login"}
            />
          </div>

          <div className="flex items-center gap-3 py-0.5">
            <span className="h-px flex-1 bg-linear-to-r from-transparent to-neutral-300 dark:to-white/15" />
            <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
              or
            </span>
            <span className="h-px flex-1 bg-linear-to-l from-transparent to-neutral-300 dark:to-white/15" />
          </div>

          <Button
            type="button"
            onClick={googleAuth}
            disabled={loading}
            google
            text={
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold">
                <FcGoogle size={18} />
                <span>Continue with Google</span>
              </div>
            }
          />

          <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 pt-1">
            Don’t have an account?
            <button
              type="button"
              onClick={() => setLoginForm(false)}
              className="ml-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </form>
      ) : (
        /* ──────────── SIGNUP FORM ──────────── */
        <form onSubmit={signupWithEmail} className="space-y-2.5">
          <Input
            type="text"
            label="Full Name"
            placeholder="John Doe"
            state={name}
            setState={setName}
          />

          <Input
            type="email"
            label="Email"
            placeholder="name@example.com"
            state={email}
            setState={setEmail}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              state={password}
              setState={setPassword}
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              state={confirmPassword}
              setState={setConfirmPassword}
            />
          </div>

          <div className="pt-1">
            <Button
              type="submit"
              onClick={signupWithEmail}
              disabled={loading}
              text={loading ? "Creating account..." : "Sign up"}
            />
          </div>

          <div className="flex items-center gap-3 py-0.5">
            <span className="h-px flex-1 bg-linear-to-r from-transparent to-neutral-300 dark:to-white/15" />
            <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
              or
            </span>
            <span className="h-px flex-1 bg-linear-to-l from-transparent to-neutral-300 dark:to-white/15" />
          </div>

          <Button
            type="button"
            onClick={googleAuth}
            disabled={loading}
            google
            text={
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold">
                <FcGoogle size={18} />
                <span>Sign up with Google</span>
              </div>
            }
          />

          <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 pt-1">
            Already have an account?
            <button
              type="button"
              onClick={() => setLoginForm(true)}
              className="ml-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
            >
              Login
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
