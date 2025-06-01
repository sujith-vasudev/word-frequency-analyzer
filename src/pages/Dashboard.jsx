import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./style/Dashboard.css"
export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [message, setMessage] =  useState("");
  const [status, setStatus] =  useState("");
  const [data, setData] = useState([]);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleScan = async () => {
    if (url.trim() !== "") {
      setData([])
      setStatus("loading")
      setMessage("fetching data from url...")

      await axios.post("/analyze", { url }).then((response) => {

        if (response.status == 200) {
          setData(response.data.topWords);
          setMessage("Successfully fetched")
          setStatus("success")
        }
        else {
          setData([])
        }

      }).catch((error) => {
        if(error.status ===400){
            setData([])
            setMessage(error.response.data.detail)
            setStatus("error")
        }else{
                  setData([])
                setMessage("Service unavailable")
                setStatus("error")
        }

      })



    }
    else{
      setMessage("Please enter url")
      setStatus("")
    }

  };


  const handleLogOut = async () => {
    logout();
    navigate("/login");
  }

  return (

    <div className="container">
      <nav className="nav-bar"> 
        <div>Hi, {localStorage.getItem("username").toUpperCase()}</div>
         <div className="logout" onClick={handleLogOut}>Logout</div></nav>

      <div className="chart-area">
        <input value={url} disabled={status==="loading"?true:false} onChange={(e) => setUrl(e.target.value)} placeholder="Paste your link" onBlur={handleScan} />
        
        <label className={status}>{message}</label>


        <ResponsiveContainer width="99%" height={620} className={"chart-section"} min-width="99%"  >
          <BarChart data={data}>
            <XAxis dataKey="word" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>


      </div>
    </div>

  );
}
