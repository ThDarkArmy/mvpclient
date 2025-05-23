import React, { useState } from "react";
import Header from "../components/Header";
import Login from "./Login";
import Register from "./Register";


const LoginRegister = () => {
  const [haveAccount, setHaveAccount] = useState(true);

  const handleHaveAccount = (value) => {
    console.log("Value", value);
    setHaveAccount(value);
  };


  return (
    <div style={{marginBottom: 50 }}>
      <Header />
      
      {haveAccount ? (
        <Login
          handleHaveAccount={handleHaveAccount}
        />
      ) : (
        <Register
          handleHaveAccount={handleHaveAccount}
        />
      )}
    </div>
  );
};

export default LoginRegister;
