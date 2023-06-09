import React from "react";
import { Link } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function MyGigs() {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    
    queryKey: ["myGigs"],
    queryFn: () =>
      
      newRequest.get(`/gigs?userId=${currentUser._id}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/gigs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };
  console.log(currentUser._id);
 
  const handleEdit = (id) => {
      navigate(`/editgig/${id}`);
  };



  return (
    <div className="myGigs">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Clases</h1>
            {currentUser.isTutor && (
              <Link to="/add">
                <button>Agregar nueva Clase</button>
              </Link>
            )}
          </div>
          <table>
            <tr>
              <th>Imagen</th>
              <th>Titulo</th>
              <th>Precio</th>
              <th>Ventas</th>
              <th>Accion</th>
            </tr>
            {data.map((gig) => (
              <tr key={gig._id}>
                <td>
                  <img className="image" src={gig.image} alt="" />
                </td>
                <td><Link to={`/gig/${gig._id}`} className="link-unstyled">
                {gig.title}</Link></td>
                <td>{gig.price}</td>
                <td>{gig.sales}</td>
                <td>
                <img
                    className="delete"
                    src="./img/edit.png"
                    alt=""
                    onClick={() => handleEdit(gig._id)}
                  />
                  <img style={{marginLeft: "10px"}}
                    className="delete"
                    src="./img/delete.png"
                    alt=""
                    onClick={() => handleDelete(gig._id)}
                  />
                </td>
              </tr>
            ))}
          </table>
        </div>
      )}
    </div>
  );
}

export default MyGigs;