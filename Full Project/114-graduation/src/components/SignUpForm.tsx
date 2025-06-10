import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FormData, Errors } from "../types/types";

interface SignUpFormProps {
  formData: FormData;
  errors: Errors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  shake: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ formData, errors, handleChange, handleSubmit, shake }) => {
  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8187/api/v1/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phonenumber: formData.phone,
      });

      console.log("Registration successful:", response.data);
      alert("Registration successful!");

      // Automatically log in the user after successful registration
      const loginResponse = await axios.post("http://localhost:8187/api/v1/auth/authenticate", {
        email: formData.email,
        password: formData.password,
      });

      if (loginResponse.status === 200) {
        const token = loginResponse.data.token;
        localStorage.setItem("jwtToken", token);

        const userResponse = await axios.get(`http://localhost:8187/api/users/email/${formData.email}`);
        if (userResponse.status === 200) {
          const username = userResponse.data.username;
          const role = userResponse.data.role;
          const idu = userResponse.data.id;
          const emailu = userResponse.data.email;
          const phoneu = userResponse.data.phonenumber;
          localStorage.setItem("username", username);
          localStorage.setItem("role", role);
          localStorage.setItem("id", idu);
          localStorage.setItem("email", emailu);
          localStorage.setItem("phone", phoneu);

          // Navigate based on the role
          if (role === "ROLE_ADMIN" || role === "ROLE_USER") {
            window.location.href = "http://localhost:5173/"; // Navigate to the main layout for both roles
          } else {
            alert("Unknown role. Please contact support.");
          }
        }
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during registration or login:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="sign-up">
      <form onSubmit={handleFormSubmit} className={shake ? "shake" : ""}>
        <h1>Create Account</h1>
        <span>Use email for registration</span>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <p className="error">{errors.username}</p>}

        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <input
          id="phoneInput"
          name="phone"
          type="text"
          placeholder="Ex: 01110000000"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
