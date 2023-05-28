import React from "react";
import "./Footer.scss";

function Footer() {
  return (
    <div className="footer">
      <div className="container">
       
        
        <div className="bottom">
          <div className="left">
            <h2>Studia</h2>
            <span>© Studia International Ltd. 2023</span>
          </div>
          <div className="right">
            <div className="social">
              <img src="/img/twitter.png" alt="" />
              <img src="/img/linkedin.png" alt="" />
              <a href="https://www.instagram.com/proyecto.studia/">
              <img src="/img/instagram.png" alt="" />
              </a>
            </div>
            <div className="link">
              <img src="/img/coin.png" alt="" />
              <span>ARS</span>
            </div>
            <img src="/img/accessibility.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;