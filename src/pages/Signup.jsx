import React from "react";
import SignupSignin from "../components/SignupSignin";

function Signup({ onSuccess, onBack }) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <SignupSignin
        onSuccess={onSuccess}
        onBack={onBack}
      />
    </div>
  );
}

export default Signup;
