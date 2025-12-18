import Button from './Common/Button'
import Input from './Common/Input'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword , 
  signInWithPopup,
} from "firebase/auth";
import { auth, db, provider } from '../firebase'
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
function SignupSignin() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm , setLoginForm] = useState(false);
  const navigate = useNavigate();

  async function signupWithEmail(e) {
    e.preventDefault();
    setLoading(true);

      try {
        if (!name || !email || !password || !confirmPassword) {
          toast.error("Please fill all the fields");
          return;
        }

        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        toast.loading("Signing up...")

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        toast.dismiss(); 
        toast.success("Signed up successfully");

        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        await createDoc(user)

        navigate("/dashboard")

      } catch (error) {
        toast.dismiss();
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
  }

  async function loginUsingEmail(e){
    e.preventDefault();
    setLoading(true);

    try {
      if(!email || !password){
        toast.error("Please fill all the fields");
        return;
      }

      toast.loading("Logining...")
      await signInWithEmailAndPassword(auth, email, password)

      toast.dismiss();
      toast.success("Logged in successfully");

      setEmail("");
      setPassword("");

      navigate("/dashboard")
        // ...
    } catch (error) {
      toast.dismiss();
      toast.error("Email or password is incorrect", error);
    } finally {
      setLoading(false);
    }
  }

  async function createDoc(user){
    // creating doc for user
    setLoading(true);
    if(!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if(!userData.exists()){
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName: name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL  : "",
          createdAt: new Date(),  
        });
        toast.success("Doc created!");
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    } else{
      toast.error("Doc already exists!");
      setLoading(false);
    }
    
  }
  
  async function googleAuth(e) {
    e.preventDefault();
    setLoading(true);
    try {
      toast.loading(" GoogleAuthenticating...");

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await createDoc(user);

      toast.dismiss();
      toast.success("User Authenticated Successfully!");

      navigate("/dashboard");

    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
      
    } finally{
      setLoading(false);
    }
  }

  return (
    <>
      {loginForm ? (
        <div className=" w-full max-w-sm sm:max-w-md rounded-2xl bg-black/50 backdrop-blur-2xl border border-white/10 shadow-xl p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-semibold text-center mb-5">
            Login on <span className="text-blue-400">Spendzy</span>
          </h2>

          <form className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="johndoe911@gmail.com"
              state={email}
              setState={setEmail}
            />

            <Input
              type="password"
              label="Password"
              placeholder="Example@123"
              state={password}
              setState={setPassword}
            />

            <Button
              onClick={loginUsingEmail}
              disabled={loading}
              text={loading ? "Loading..." : "Login"}
            />

            <p className="text-center text-xs text-gray-400">or</p>

            <Button
              onClick={googleAuth}
              google
              type="button"
              text={
                loading ? (
                  "Loading..."
                ) : (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <FcGoogle size={18} />
                    <span>Login with Google</span>
                  </div>
                )
              }
            />

            <p className="text-center text-xs text-gray-400">
              Don’t have an account?
              <span
                onClick={() => setLoginForm(false)}
                className="ml-1 text-blue-400 cursor-pointer hover:underline"
              >
                Signup
              </span>
            </p>
          </form>
        </div>
      ) : (
        <div className="
          w-full max-w-sm sm:max-w-md
          rounded-2xl
          bg-black/50 backdrop-blur-2xl
          border border-white/10
          shadow-xl
          p-6 sm:p-8
        ">
          <h2 className="text-lg sm:text-xl font-semibold text-center mb-5">
            Sign up on <span className="text-blue-400">Spendzy</span>
          </h2>

          <form className="space-y-4">
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
              placeholder="johndoe911@gmail.com"
              state={email}
              setState={setEmail}
            />

            <Input
              type="password"
              label="Password"
              placeholder="Example@123"
              state={password}
              setState={setPassword}
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="Example@123"
              state={confirmPassword}
              setState={setConfirmPassword}
            />

            <Button
              onClick={signupWithEmail}
              disabled={loading}
              text={loading ? "Loading..." : "Signup"}
              type="submit"
            />

            <p className="text-center text-xs text-gray-400">or</p>

            <Button
              onClick={googleAuth}
              google
              type="button"
              text={
                loading ? (
                  "Loading..."
                ) : (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <FcGoogle size={18} />
                    <span>Signup with Google</span>
                  </div>
                )
              }
            />

            <p className="text-center text-xs text-gray-400">
              Already have an account?
              <span
                onClick={() => setLoginForm(true)}
                className="ml-1 text-blue-400 cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </form>
        </div>
      )}
    </>
  );


}

export default SignupSignin