import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import "./AuthModal.css";
import api, { setAuthToken } from "../services/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModalComponent: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false); // Toggle between login & register
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
          first_name: formData.firstName,
          last_name: formData.lastName,
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
    <div className="overlay" data-testid="overlay" onClick={onClose}>
      <div 
        className="modal"
        role="dialog"
        aria-modal="true"
        data-testid="auth-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="titleBar">
          <span className="windowIcon" aria-hidden="true"><FontAwesomeIcon icon={faRightFromBracket} /></span>
          <h2 className="titleText">{isRegister ? "Register" : "Login"}</h2>
          <button className="closeButton" onClick={onClose} aria-label="Close modal">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </header>

        <main className="modalContent">
          {isRegister && (
            <>
              <label htmlFor="firstName" className="label">First Name</label>
              <input 
                id="firstName" 
                type="text" 
                name="firstName" 
                className="input" 
                onChange={handleChange}
                autoFocus
              />
              <label htmlFor="lastName" className="label">Last Name</label>
              <input 
                id="lastName" 
                type="text" 
                name="lastName" 
                className="input" 
                onChange={handleChange}
              />
            </>
          )}

          <label htmlFor="email" className="label">Email</label>
          <input 
            id="email" 
            type="email" 
            name="email" 
            className="input" 
            onChange={handleChange}
            autoFocus={!isRegister}
          />

          <label htmlFor="password" className="label">Password</label>
          <input id="password" type="password" name="password" className="input" onChange={handleChange} />

          {error && <p className="error">{error}</p>}

          <button className="loginButton" onClick={handleSubmit}>
            {isRegister ? "REGISTER" : "LOGIN"}
          </button>

          <a
            href="#"
            className="createAccount" 
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Already have an account? Login" : "Create an account"}
          </a>
        </main>
      </div>
    </div>
  );
};

export default AuthModalComponent;
