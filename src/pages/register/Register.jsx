import React, { useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Register() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    img: "",
    country: "",
    city: "",
    isTutor: false,
    desc: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleTutor = (e) => {
    setUser((prev) => {
      return { ...prev, isTutor: e.target.checked };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = await upload(file);
    try {
      await newRequest.post("/auth/register", {
        ...user,
        img: url,
      });
      navigate("/login")
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Crear nueva cuenta</h1>
          <label htmlFor="">Usuario</label>
          <input
            name="username"
            type="text"
            placeholder="pabloperez08"
            onChange={handleChange}
          />
             <label htmlFor="">Nombre</label>
          <input
          name="name"
          type="text"
          placeholder="Pablo"
          onChange={handleChange}
        />
          <label htmlFor="">Email</label>
          <input
            name="email"
            type="email"
            placeholder="email@mail.com"
            onChange={handleChange}
          />
          <label htmlFor="">Contraseña</label>
          <input name="password" type="password" onChange={handleChange} />
          <label htmlFor="">Foto de Perfil</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <label htmlFor="">Pais</label>
          <input
            name="country"
            type="text"
            placeholder="Argentina"
            onChange={handleChange}
          />
          <label htmlFor="">Ciudad</label>
          <input
            name="city"
            type="text"
            placeholder="Buenos Aires"
            onChange={handleChange}
          />
                <button type="submit">Registarse</button>
        </div>
        <div className="right">
          <h1>Queres ser Tutor?</h1>
          <h2 htmlFor="">Rellena estos datos adicionales</h2>
          <div className="toggle">
            <label htmlFor="">Cuenta en modo Tutor</label>
            <label className="switch">
              <input type="checkbox" onChange={handleTutor} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="">Celular</label>
          <input
            name="phone"
            type="text"
            placeholder="+11 4438 1452"
            onChange={handleChange}
          />
          <label htmlFor="">Descripcion</label>
          <textarea
            placeholder="Una pequeña descripcion sobre vos"
            name="desc"
            id=""
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
}

export default Register;
