import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/css/AuthModal.module.css";
import api, { setAuthToken } from "../services/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModalComponent: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false); // Toggle between login & register
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    setError(null);
    try {
      let response;
      if (isRegister) {
        response = await api.post("/auth/register", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
      }

      setAuthToken(response.data.token);
      navigate("/game");
      onClose();
    } catch (err: any) {
      const firstError = err.response?.data?.errors?.[0] || "An error occurred.";
      setError(firstError);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "Enter") {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleSubmit, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.titleBar}>
          <span className={styles.windowIcon}>🗔</span>
          <span className={styles.titleText}>{isRegister ? "Register" : "Login"}</span>
          <button className={styles.closeButton} onClick={onClose}>✖</button>
        </div>

        <div className={styles.modalContent}>
          {isRegister && (
            <>
              <label className={styles.label}>Username</label>
              <input type="text" name="username" className={styles.input} onChange={handleChange} />
            </>
          )}

          <label className={styles.label}>Email</label>
          <input type="email" name="email" className={styles.input} onChange={handleChange} />

          <label className={styles.label}>Password</label>
          <input type="password" name="password" className={styles.input} onChange={handleChange} />

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.loginButton} onClick={handleSubmit}>
            {isRegister ? "REGISTER" : "LOGIN"}
          </button>

          <a href="#" className={styles.createAccount} onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Already have an account? Login" : "Create an account"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthModalComponent;
