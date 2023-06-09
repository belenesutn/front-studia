import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import newRequest from "../../utils/newRequest";
import logo from "../../assets/logo.png"
import logoinv from "../../assets/logoinv.png"

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const apply = () => {
    refetch();
  };

  const { pathname } = useLocation();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
          <img className="dot"
                src={!active && pathname === "/" ? logoinv : logo}
                alt=""
              />
          </Link>
        </div>
        <div className="links">
          <Link className="link" to="/about">
          <span>Cómo Funciona</span></Link>
          {!currentUser?.isTutor && <Link className="link" to="/aboutTutor"><span>Conviértete en Tutor</span></Link>}
          {currentUser ? (
            <div className="user" onClick={()=>setOpen(!open)}>
              <img src={currentUser.img || "./img/noavatar.jpg"} alt=""/>
              <span>{currentUser?.username}</span>
              {open && <div className="options">
                <Link className="link" to="/edit">
                      Editar Perfil
                </Link>
                {currentUser.isTutor && (
                  <>
                    <Link className="link" to="/mygigs">
                      Mis Clases
                    </Link>
                    <Link className="link" to="/add">
                      Agregar nueva Clase
                    </Link>
                  </>
                )}
                <Link className="link" to="/class">
                  Solicitudes de Clase
                </Link>
                <Link className="link" to="/messages">
                  Mensajes
                </Link>
                <Link className="link" onClick={handleLogout}>
                  Cerrar Sesion
                </Link>
              </div>}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">Login</Link>
              <Link className="link" to="/register">
                <button>Registrate!</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            <Link onClick={apply} className="link menuLink" to="/gigs?cat=quimica">
            Ingeniería Química
            </Link>
            <Link onClick={apply} className="link menuLink" to="/gigs?cat=sistema">
            Ingeniería en Sistemas
            </Link>
            <Link onClick={apply} className="link menuLink" to="/gigs?cat=electrica">
            Ingeniería Eléctrica
            </Link>
            <Link onClick={apply} className="link menuLink" to="/gigs?cat=mecanica">
            Ingeniería Mecánica
            </Link>
            <Link onClick={apply} className="link menuLink" to="/gigs?cat=basica">
              Materias Básicas
            </Link>
          </div>
          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;