import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { fecha } from "../../data";
import Multipleselect from "../../components/multipleselect/Multipleselect";

const Add = () => {
  
  const [singleFile, setSingleFile] = useState(undefined);

  const [uploading, setUploading] = useState(false);
  
  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleselectchange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: "schedule", value: e.map(option => option.value) },
    });
  }

   const handletopics = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_topics",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const image = await upload(singleFile);
                setUploading(false);
      dispatch({ type: "CHANGE_INPUT", payload: {name:"image", value: image }});
    } catch (err) {
      console.log(err);
    }
  };

  const handleMode = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: "isOnline", value: e.target.checked },
    });
  };

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs", gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleSubmit = (e) => {

    if (!state.title || !state.cat || !state.desc || !state.shortDesc || !state.price) {
      alert("Por favor, completa todos los campos");
      return;
    }

    if (state.price <0)
      {alert("Por favor ingresar un valor positivo")
    return;}

    e.preventDefault();
    mutation.mutate(state);
    navigate("/mygigs")
  };

  console.log(state)
  return (
    <div className="add">
      <div className="container">
        <h1>Agregar nueva Clase</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="">Titulo</label>
            <input
              type="text"
              placeholder="Ejemplo: Analisis Matematico "
              onChange={handleChange}
              name="title"
            />
            <label htmlFor="">Categoria</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value=""></option>
              <option value="basica" >Materia Basica</option>
              <option value="sistema">Sistemas</option>
              <option value="quimica">Quimica</option>
              <option value="electrica">Electrica</option>              
              <option value="mecanica">Mecanica</option>
            </select>
           <label htmlFor="">Acerca de la Clase</label>
            <textarea  onChange={handleChange} name="desc" id="desc" placeholder="Descripcion para presentar la clase a tus alumnos, contando quien sos y experiencias y estudios. Por que crees que te tienen que elegir ?" cols="0" rows="16"></textarea>
            <label htmlFor="">Descripcion breve</label>
            <textarea onChange={handleChange} name="shortDesc" id="shortDesc" placeholder="Breve descripcion de la clase" cols="0" rows="4"></textarea>
            </div>


          <div className="details">
          <label htmlFor="">Imagen de la Clase</label>
            <input type="file" name="image"  onChange={(e) => setSingleFile(e.target.files[0])}
             />
             <button onClick={handleUpload}>
                {uploading ? "subiendo..." : "Subir"}
              </button>
            <label htmlFor="">Horario</label>
            <Multipleselect options={fecha} onChange = {handleselectchange} />
              <label htmlFor="">Agregar Temas</label>
            <form action="" className="add" onSubmit={handletopics}>
              <input type="text" placeholder="Derivadas" />
              <button type="submit">Agregar</button>
            </form>
            <div className="addedtopics">
              {state?.topics?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_topics", payload: f })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
              
            </div>
            <div className="toggle">
            <label htmlFor="">Clase Virtual?</label>
            <label className="switch">
              <input type="checkbox" onChange={handleMode} />
              <span className="slider round"></span>
            </label>
            </div>
            <label htmlFor="">Precio por hora</label>
            <input type="number" min="0" onChange={handleChange} name="price"/>
          </div>
          
        </div>
        <div className="container">
        <div className="add">
        <button onClick={handleSubmit}>
                {uploading ? "Creando..." : "Crear"}
        </button>
                </div>
                </div>
      </div>
    </div>
  );
};

export default Add;