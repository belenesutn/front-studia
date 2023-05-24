import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import newRequest from "../../utils/newRequest";
import Review from "../review/Review";
import "./Reviews.scss";
import Alert from '@mui/material/Alert';


const Reviews = ({ gigId }) => {

  const [isForbidden, setIsForbidden] = React.useState(false);
  const queryClient = useQueryClient()
  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
      newRequest.get(`/reviews/${gigId}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post("/reviews", review);
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(["reviews"])
    },
    onError: (error) => {
      if (error.response && error.response.status === 403) {
        setIsForbidden(true);
      }
    },
  });

  const handleSubmit = (e) => {
    const confirmed = window.confirm("¿Estás seguro de enviar la reseña?");
    if (confirmed) {
    e.preventDefault();
    const desc = e.target[1].value;
    const star = e.target[0].value;
    mutation.mutate({ gigId, desc, star });
    console.log(e);}
  };

  return (
    <div className="reviews">
          <div className="add">
        <h3>Agregar Reseña</h3>
        {isForbidden && <Alert severity="error">Error: No puedes realizar reseñas!</Alert>}
        <form action="" className="addForm" onSubmit={handleSubmit}>
          <div className="puntuar">         
            <img src="/img/star.png"/>
             <div>
                <select name="" id="">
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </select>
             </div>
        </div>
        <input type="text" placeholder="Escriba su reseña aqui" />
          <button>Enviar</button>
          
        </form>
      </div>
    </div>
  );
};

export default Reviews;