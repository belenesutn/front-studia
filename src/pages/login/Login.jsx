import React, { useState } from "react";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/auth/login", { username, password });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/")
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Ingresar</h1>
        <label htmlFor="">Nombre de Usuario</label>
        <input
          name="username"
          type="text"
          placeholder="Usuario"
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="">Contraseña</label>
        <input
          name="password"
          type="password"
          placeholder="**********"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
        {error && error}
      </form>
    </div>
  );
}

export default Login;