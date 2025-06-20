import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./style/Login.css"
export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("")
  const [requestStatus, setrequestStatus] = useState(false)


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    setrequestStatus(true)
    setMessage("")
    e.preventDefault();

    await axios.post("/login", form).then((response) => {
      login(response.data.result.username, response.data.result.access_token, response.data.result.refresh_token);
      navigate("/dashboard");
    }).catch((error) => {
      console.log(error)
      if (error.status === 400) {
        setMessage(error.response.data.message)
      }
      else {
        setMessage("Service unavailable, please try again or contact administartor")
      }
    })

    setrequestStatus(false)

  };

  return (
    <div className="login-container">
      <div></div>

      <div>
        <form onSubmit={handleSubmit}>

          {requestStatus ? <label>Verifying user credentials ...</label> : null}

          <label className={message ? "errorMessage" : ""}>{message}</label>

          <input name="username" onChange={handleChange} placeholder="Username" required={true} />
          <input name="password" type="password" onChange={handleChange} placeholder="Password" required={true} />


          <div className="button-group">
            <input type="submit" value={"Login"} disabled={requestStatus} />
            <input type="submit" value={"Register"} onClick={() => navigate("/register")} />
          </div>
        </form>
      </div>
      <div></div>
    </div>
  );
}
