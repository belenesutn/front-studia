import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Messages.scss";
import moment from "moment";

const Messages = () => {

const [names, setNames] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      newRequest?.get(`/conversations`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest?.put(`/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient?.invalidateQueries(["conversations"]);
    },
  });

  const handleRead = (id) => {
    mutation?.mutate(id);
  };

  return (
    <div className="messages">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Mensajes</h1>
          </div>
          <table>
            <tr>
              <th>{currentUser.isTutor ? "Estudiante" : "Tutor"}</th>
              <th>Ultimo Mensaje</th>
              <th>Fecha</th>
              <th>Accion</th>
            </tr>
            {data.map((c) => (
              <tr
                className={
                  ((currentUser.isTutor && !c.readByTutor) ||
                    (!currentUser.isTutor && !c.readByStudent)) &&
                  "active"
                }
                key={c.id}
              > 
              <td>{c.name}</td>
               <td>
                  <Link to={`/message/${c.id}`} className="link">
                    {c?.lastMessage?.substring(0, 100)}...
                  </Link>
                </td>
                <td>{moment(c.updatedAt).fromNow()}</td>
                <td>
                  {((currentUser.isTutor && !c.readByTutor) ||
                    (!currentUser.isTutor && !c.readByStudent)) && (
                    <button onClick={() => handleRead(c.id)}>
                      Marcar como leido
                    </button>
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

export default Messages;