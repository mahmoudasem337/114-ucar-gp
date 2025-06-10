import React from "react";
import { FormData, Errors } from "../types/types";
import { useNavigate } from "react-router-dom";
interface SignInFormProps {
  formData: FormData;
  errors: Errors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  sendOTP: () => Promise<void>;
}

const SignInForm: React.FC<SignInFormProps> = ({ formData, errors, handleChange, handleSubmit, sendOTP }) => {
  const navigate = useNavigate();
  return (
    <div className="sign-in">
      <form onSubmit={handleSubmit}>
        <h1>Sign In</h1>

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

        <a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    sendOTP().then(() => {
      alert("OTP sent to your email!");
      navigate("/ResetPassword");
    });
  }}
>
  Forgot password?
</a>

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignInForm;
