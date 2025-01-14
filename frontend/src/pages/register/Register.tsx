import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../../context/AuthContext";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm_password, setConfirmPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    if (!username || !email || !password || !confirm_password) {
      toast.error("Please fill all the fields!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        // transition: Bounce,
      });
      setLoading(false);
      return;
    }

    if (password !== confirm_password) {
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        // transition: Bounce,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/register", {
        username,
        email,
        password,
        confirm_password,
      });

      const token: string = response.data.token;

      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      login(token);
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response.data.detail || "Something went wrong!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="auth-container">
        <div className="auth-box">
          <span className="auth-box-title">
            <h2>Register</h2>
          </span>
          <form className="auth-form" onSubmit={handleRegister}>
            {/*User Input */}
            <div className="auth-input">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <FaUser className="auth-icons" />
            </div>

            {/* Email Input */}
            <div className="auth-input">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <IoMdMail className="auth-icons" />
            </div>

            {/* Password Input */}
            <div className="auth-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="auth-icons" onClick={handleShowPassword}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            {/*Confirm Password Input */}
            <div className="auth-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirm_password}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="auth-icons" onClick={handleShowConfirmPassword}>
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            {/* Register Button */}
            <button type="submit" disabled={loading}>
              {loading ? (
                <ClipLoader color="#3498db" loading={loading} size={20} />
              ) : (
                "Register"
              )}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
