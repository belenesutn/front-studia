import React, { useEffect, useState } from "react";
import upload from "../../utils/upload";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import getCurrentUser from "../../utils/getCurrentUser";
import "./Edit.scss"

function Edit() {
    
  const currentUser = getCurrentUser();
  const id  = currentUser._id; 
  const navigate = useNavigate();
  console.log(id);

  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    img: "",
    country: "",
    city: "",
    desc: "",
  });

  // Obtener los datos del usuario actualmente registrado desde el servidor
  useEffect(async () => {
   await newRequest.get(`/users/${id}`)  //newRequest.get()
      .then((response) => response.json())
      .then((data) => {
        setUser(data); // Actualizar el estado con los datos del usuario obtenidos del servidor
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enviar los datos actualizados del usuario al servidor para guardar los cambios
    try {
      await newRequest.post(`/users/${id}`, {
        ...user,
        img: file ? await upload(file) : user.img, // Si se seleccionó un nuevo archivo de imagen, subirlo y obtener la URL, de lo contrario, mantener la URL existente
      });
      // Redirigir al perfil del usuario después de guardar los cambios exitosamente
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="edit">
      <form onSubmit={handleSubmit}>
      <h1>Editar perfil</h1>
        <label htmlFor="img">Foto de perfil</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <label htmlFor="country">País</label>
        <input
          name="country"
          type="text"
          value={user.country}
          onChange={handleChange}
        />
        <label htmlFor="city">Ciudad</label>
        <input
          name="city"
          type="text"
          value={user.city}
          onChange={handleChange}
        />
        <label htmlFor="desc">Descripción</label>
        <textarea
          name="desc"
          value={user.desc}
          onChange={handleChange}
        ></textarea>
        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
}

export default Edit;