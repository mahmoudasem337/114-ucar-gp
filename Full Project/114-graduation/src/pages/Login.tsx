import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Inputmask from "inputmask";
import axios from "axios";
import SignUpForm from "../components/SignUpForm";
import SignInForm from "../components/SignInForm";
import TogglePanel from "../components/TogglePanel";
import { FormData, Errors } from "../types/types";
import "../styles/login.css";

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [shake, setShake] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    phone: "",
    otp: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    Inputmask("99999999999").mask("#phoneInput");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: Errors = {};

    if (isSignUp && formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with 1 uppercase and 1 number";
    }

    if (isSignUp && formData.phone.length !== 11) {
      newErrors.phone = "Phone number must be 11 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOTP = async () => {
    try {
      await axios.post("http://localhost:5000/forgot-password", { email: formData.email });
      alert("OTP sent to your email!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } else {
      if (isSignUp) {
        alert("Account Created!");
        navigate("/profile");
      } else {
        try {
          const response = await axios.post("http://localhost:8187/api/v1/auth/authenticate", {
            email: formData.email,
            password: formData.password,
          });

          if (response.status === 200) {
            const token = response.data.token; 
            localStorage.setItem("jwtToken", token); 

            const userResponse = await axios.get(`http://localhost:8187/api/users/email/${formData.email}`);
            if (userResponse.status === 200) {
              const username = userResponse.data.username; 
              const role = userResponse.data.role; 
              const idu = userResponse.data.id; 
              const emailu= userResponse.data.email;
              const phoneu= userResponse.data.phonenumber;
              localStorage.setItem("username", username); 
              localStorage.setItem("role", role); 
              localStorage.setItem("id", idu); 
              localStorage.setItem("email", emailu); 
              localStorage.setItem("phone", phoneu); 

              // Navigate based on the role
              if (role === "ROLE_ADMIN") {
                window.location.href = "http://localhost:5173/"; // Navigate to the main layout for both roles
              } 
            else if (role === "ROLE_USER") {
              window.location.href = "http://localhost:5173/"; // Navigate to the main layout for both roles

            }else {
                alert("Unknown role. Please contact support.");
              }
            }
          } else {
            alert("Login failed. Please check your credentials.");
          }
        } catch (error) {
          console.error("Error during login:", error);
          alert("An error occurred during login. Please try again.");
        }
      }
    }
  };

  return (
    <div className={`container ${isSignUp ? "active" : ""}`} id="container">
      {isSignUp ? (
        <SignUpForm
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          shake={shake}
        />
      ) : (
        <SignInForm formData={formData} errors={errors} handleChange={handleChange} handleSubmit={handleSubmit} sendOTP={sendOTP} />
      )}
      <TogglePanel setIsSignUp={setIsSignUp} />
    </div>
  );
};

export default Login;
