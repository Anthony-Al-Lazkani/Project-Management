import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    if (!username || !password) {
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

    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/login", {
        username,
        password,
      });

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

      setUsername("");
      setPassword("");
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
        <div className="auth-box login">
          <span className="auth-box-title">
            <h2>Login</h2>
          </span>
          <form className="auth-form" onSubmit={handleLogin}>
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

            {/* Login Button */}
            <button type="submit" disabled={loading}>
              {loading ? (
                <ClipLoader color="#3498db" loading={loading} size={20} />
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
