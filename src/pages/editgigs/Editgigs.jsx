import "./Editgigs.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate, useParams } from "react-router-dom";
import { fecha } from "../../data";
import React, { useReducer } from "react";
import Multipleselect from "../../components/multipleselect/Multipleselect";
import { useQuery } from "@tanstack/react-query";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import { useQueryClient, useMutation } from "@tanstack/react-query"; // Import the queryClient

function Editgigs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);
  const queryClient = useQueryClient(); // Create an instance of queryClient

  const { isLoading, error, data } = useQuery({
    queryKey: ["gig"],
    queryFn: () =>
      newRequest.get(`/gigs/${id}`).then((res) => {
        setDataToState(res.data);
        return res.data;
      }),
  });

  const setDataToState = (data) => {
    const { title, desc, shortDesc, price } = data;
    dispatch({ type: "CHANGE_INPUT", payload: { name: "title", value: title } });
    dispatch({ type: "CHANGE_INPUT", payload: { name: "desc", value: desc } });
    dispatch({ type: "CHANGE_INPUT", payload: { name: "shortDesc", value: shortDesc } });
    dispatch({ type: "CHANGE_INPUT", payload: { name: "price", value: price } });
  };


  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleselectchange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: "schedule", value: e.map((option) => option.value) },
    });
  };
  
  const mutation = useMutation({
    mutationFn: async () => {
      await newRequest.put(`/gigs/${id}`, { ...state});
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(state);
    navigate("/mygigs");
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }
  return (
    <div className="edit2">
      <form>
        <h1>Editar Clase:</h1>
        <h2>{data?.title}</h2>
        <div className="divje">
          <label htmlFor="">Horario</label>
          <Multipleselect options={fecha} onChange={handleselectchange} />
          <label htmlFor="desc">Descripción</label>
          <textarea
            cols="0"
            rows="4"
            name="desc"
            value={state?.desc}
            onChange={handleChange}
          ></textarea>
          <label htmlFor="shortDesc">Descripción Corta</label>
          <textarea
            cols="0"
            rows="4"
            name="shortDesc"
            value={state?.shortDesc}
            onChange={handleChange}
          ></textarea>
          <label htmlFor="price">Precio</label>
          <input
            name="price"
            type="text"
            value={state?.price}
            onChange={handleChange}
          />
        </div>
        <button type="submit" onClick={handleSubmit} >Guardar cambios</button>
      </form>
    </div>
  );
}

export default Editgigs;
