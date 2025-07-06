import Button from '../Button';
import Input from '../input'
import './style.css'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword , 
  signInWithPopup,
} from "firebase/auth";
import { auth, db, provider } from '../../firebase'
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
        console.log("Trying to sign up .......")
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User >>>> ", user);

        toast.dismiss(); 
        toast.success("Signed up successfully");

        // clear fields
        setLoading(false)
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        createDoc(user)
        navigate("/dashboard")

      } catch (error) {
        toast.dismiss();
        toast.error(error.message);
        console.log("Error creating user");

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
      console.log("Trying to login .......")
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;
      console.log("User >>>> ", user);

      toast.dismiss();
      toast.success("Logged in successfully");

      // clear fields
      setLoading(false)
      setEmail("");
      setPassword("");
      navigate("/dashboard")
        // ...
    } catch (error) {
      toast.dismiss();
      toast.error("Email or password is incorrect");
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error logging in", errorCode, errorMessage);  
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
      await createUserDocument(user);
      toast.success("User Authenticated Successfully!");
      navigate("/dashboard");

    } catch (error) {
      toast.error(error.message);
      console.error("Error signing in with Google: ", error.message);
    } finally{
      setLoading(false);
      toast.dismiss();
    }
    
  }


  return (
    <>
    { loginForm 
      ?  <div className='signup-wrapper'>
          <h2 className='title'>
            Login on <span style={{color: '#4226f8'}}>Spendzy</span>
          </h2>
          <form >
             
            <Input 
              type="email"
              label={"Email"}
              placeholder={"johndoe911@gmail.com"}
              state={email}
              setState={setEmail}
            /> 
            <Input 
              type="password"
              label={"Password"}
              placeholder={"Example@123"}
              state={password}
              setState={setPassword}
            /> 
            <Button 
              onClick={loginUsingEmail}
              disabled={loading}
              text={loading ? "Loading..." : "Login"} 
            /> 

            <p className='p-login'>Or</p>

            <Button 
              onClick={googleAuth} 
              text={
                loading ? "Loading..." : (
                <div className='google'>
                  <FcGoogle size={24} />
                  Signup with Google
                </div>
              )} 
              google={true} 
              type="button" 
            />
            <p  className='p-login'>Or Dont have An Account? <span onClick={() => setLoginForm(false)} style={{color: "#4226f8", cursor: "pointer", fontSize: "0.9rem"}}> Signup</span></p>
          </form>
        </div> 

      : <div className='signup-wrapper'>
          <h2 className='title'>
            Sign Up on <span style={{color: '#4226f8'}}>Spendzy</span>
          </h2>
          <form  >
            <Input 
              type="text"
              label={"Full Name"}
              placeholder={"John Doe"}
              state={name}
              setState={setName}
            /> 
            <Input 
              type="email"
              label={"Email"}
              placeholder={"johndoe911@gmail.com"}
              state={email}
              setState={setEmail}
            /> 
            <Input 
              type="password"
              label={"Password"}
              placeholder={"Example@123"}
              state={password}
              setState={setPassword}
            /> 
            <Input 
              type="password"
              label={"Confirm Password"}
              placeholder={"Example@123"}
              state={confirmPassword}
              setState={setConfirmPassword}
            />
            <Button 
              onClick={signupWithEmail}
              disabled={loading}
              text={loading ? "Loading..." : "Signup"} 
              type="submit" 
            /> 

            <p className='p-login'>Or</p>

            <Button 
              onClick={googleAuth} 
              text={
                loading ? "Loading..." : (
                <div className='google'>
                  <FcGoogle size={24} />
                  Signup with Google
                </div>
              )} 
              google={true} 
              type="button" 
            />

            <p className='p-login'>Have An Account ? <span onClick={() => setLoginForm(true)} style={{color: '#4226f8', cursor: "pointer", fontSize: "0.9rem"}}>Login</span></p>
          </form>
        </div> 
    }
     
    </>
    
  )
}

export default SignupSignin