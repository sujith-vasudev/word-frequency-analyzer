import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import "./style/Register.css"
export default function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("")
  const [requestStatus, setrequestStatus] = useState(false)
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("")
    setrequestStatus(true)
    await axios.post("/register", form)
      .then(response => {
        if (response.status === 201) {
          console.log(" Registration successful:", response.data);
          navigate("/login")
        }
      }).catch((error) => {
        if (error.status === 400) {
          setError(error.response.data.message)
        }
        else {
          setError("Service unavailable, please try again or contact administartor")
        }

      })
    setrequestStatus(false)


  };

  return (

    <div className="register-container">

      <div></div>

      <div>

        <form onSubmit={handleSubmit} className="regisetr-form">

          <div className="errorMessage">{error}</div>

          {requestStatus ? <label>Registering user...</label> : null}

          <input name="username" onChange={handleChange} placeholder="Username" required={true} /><br></br>
          <input name="password1" type="password" onChange={handleChange} placeholder="Password" required={true} />
          <input name="password2" type="password" onChange={handleChange} placeholder="Re-type Password" required={true} /><br></br>


          <div className="register-button-group">

            <div className="register-area">
              <button type="submit" disabled={requestStatus} >Register</button>
              <button type="reset">Clear</button>
            </div>
            <div className="login-area">
              <button type="submit" onClick={() => navigate("/login")}>Login</button>
            </div>
          </div>
        </form>

      </div>
    </div>

  );
}
