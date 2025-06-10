import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios"; 
import "../styles/resetPassword.css";

interface ResetPasswordState {
  email: string;
  otp: string;
  newPassword: string;
  error: string;
  success: string;
}

const ResetPassword: React.FC = () => {
  const [formData, setFormData] = useState<ResetPasswordState>({
    email: "",
    otp: "",
    newPassword: "",
    error: "",
    success: "",
  });

  const navigate = useNavigate();

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setFormData({ ...formData, error: "", success: "" });

    try {
      const response = await axios.post("http://localhost:5000/reset-password", {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      setFormData({ ...formData, success: response.data.message || "Password reset successful!" });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      // التحقق إذا كان الخطأ من AxiosError باستخدام instanceof
      if (err instanceof AxiosError) {
        // التحقق من وجود رسالة في response
        const errorMessage = err.response?.data?.message || err.message || "Error resetting password. Try again.";
        setFormData({
          ...formData,
          error: errorMessage,
        });
      } else {
        // في حالة حدوث خطأ آخر (غير AxiosError)
        setFormData({
          ...formData,
          error: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="reset-wrapper">
      <div className="reset-form-container">
        <h2>🔒 Reset Password</h2>

        <form onSubmit={handleReset}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">Reset Password</button>

          {formData.error && <p className="error-msg">{formData.error}</p>}
          {formData.success && <p className="success-msg">{formData.success}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
