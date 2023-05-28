import React from 'react'
import Featured from '../../components/featured/Featured'
import "./Home.scss"
import { Link } from "react-router-dom";


function Home() {
  return (
    <div className='home'>
      <Featured/>
      <div className="features dark">
        <div className="container">
          <div className="item">
            <h1>
              Como funciona ?
            </h1>
            <h1>
              <i>Conectamos a alumnos y tutores para un aprendizaje personalizado</i>
            </h1>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Busca y compara tutores
            </div>

            <div className="title">
              <img src="./img/check.png" alt="" />
              Elige el tutor que mejor se adapte a tus necesidades
            </div>

            <div className="title">
              <img src="./img/check.png" alt="" />
              Asiste a tus clases particulares y mejora tus conocimientos
            </div>
            <Link to="/about">
            <button>Ver Mas</button>
            </Link>
          </div>
          <div className="item">
            <img
              src="./img/clase.png"
              alt=""
            />
          </div>
        </div>
      </div>
    
    </div>
  )
}


export default Home