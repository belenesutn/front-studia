import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Class.scss";
import newRequest from "../../utils/newRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const Class = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["class"],
    queryFn: () =>
      newRequest.get(`/class`).then((res) => {

        return res.data;
      }),
  });

  const handleContact = async (order) => {
    const tutorId = order.tutorId;
    const studentId = order.studentId;
    const id = tutorId + studentId;

    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.isTutor ? studentId : tutorId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  const sortedData = data?.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);    
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`/class/${id}`, {state: "ACEPTADA"});
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const mutation2 = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`/class/${id}`, {state: "RECHAZADA"});
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const mutation3 = useMutation({
    mutationFn: async (data) => {
      return newRequest.put(`/class/end/${data.id}`, {state: "FINALIZADA", gigId: data.gig});
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleAceptar = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de aprobar esta clase?");
    if (confirmed) {
      try {
        await mutation.mutateAsync(id);
        location.reload();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDenegar = async (id) => {
    const confirmed = window.confirm("¿Estás seguro de rechazar esta clase?");
    if (confirmed) {
      try {
        await mutation2.mutateAsync(id);
        location.reload();
      } catch (error) {
        console.error(error);
      }
    }
  };

  
  const handleFinalizar = async (id, gigId) => {
    const confirmed = window.confirm("¿Estás seguro de finalizar esta clase?");
    if (confirmed) {
      try {
        const data = 
        {
          id, gig: gigId
        }
        await mutation3?.mutateAsync(data);
        location.reload();
      } catch (error) {
        console.error(error);
      }
    }
  };

  
  
  return (
    <div className="class">
      {isLoading ? (
        "Cargando"
      ) : error ? (
        "Error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Solicitudes de Clases</h1>
          </div>
          <table>
            <tr>
              <th>Imagen</th>
              <th>Titulo</th>
              <th>Precio</th>
              <th>Horario</th>
              <th>Estado</th>
              <th>Acciones</th>              
              <th>Finalizar</th>
            </tr>
            {sortedData?.map((e) => (
              <tr key={e._id}>
                <td>
                  <img className="image" src={e.img} alt="" />
                </td>
                <td><Link to={`/gig/${e.gigId}`} className="link-unstyled">
                {e.title}</Link></td>
                <td>{e.price}</td>
                <td>{e.dayselected}</td>
                <td>{e.state}</td>
                <td style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection:"row"}}>
                  
                      <img
                        className="message"
                        src="./img/message.png"
                        alt=""
                        onClick={() => handleContact(e)}
                      />
                      
                    
                      {currentUser.isTutor && e.state === "CREADA" && (
                          <>
                            <img
                              className="message"
                              src="./img/greencheck.png"
                              alt=""
                              onClick={() => handleAceptar(e._id)}
                            />
                            <img 
                              className="message"
                              src="./img/cross.png"
                              alt=""
                              onClick={() => handleDenegar(e._id)}
                            />
                          </>
                        )}
                      </td>
                      <td style={{ justifyContent: "center", alignItems: "center" }}>
                       {currentUser.isTutor && e.state === "ACEPTADA" && (
                          <>
                            <button className="botonFinalizar" onClick={() => handleFinalizar(e._id, e.gigId)}>
                              Finalizar
                            </button>
                          </>
                        )}
                 
                  </td>
              </tr>
            ))}
          </table>
        </div>
      )}
    </div>
  );
};

export default Class;