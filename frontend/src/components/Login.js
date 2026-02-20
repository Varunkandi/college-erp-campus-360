import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = () => {
    fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(user => {
        if (!user) {
          alert("Invalid Username or Password");
          return;
        }

        // store session
        localStorage.setItem("user_id", user.id);
        localStorage.setItem("role", user.role);

        // redirect
        if (user.role === "admin") navigate("/admin");
        else if (user.role === "faculty") navigate("/faculty");
        else if (user.role === "student") navigate("/student");
      })
      .catch(() => alert("Backend not reachable"));
  };

  return (
    <div style={{
      background:"#020617",
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center"
    }}>
      <div style={{
        background:"#0f172a",
        padding:40,
        borderRadius:12,
        width:320,
        color:"white",
        textAlign:"center"
      }}>
        <h2>Campus 360</h2>

        <input
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />


        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}

export default Login;
