import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const GigCard = ({ item }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () =>
      newRequest.get(`/users/${item.userId}`).then((res) => {
        return res.data;
      }),
  });
  return (
    <Link to={`/gig/${item._id}`} className="link">
      <div className="gigCard">
        <img src={item.image} alt="Class image" className="cover"/>
        <div className="info">
          {isLoading ? (
            "Cargando"
          ) : error ? (
            "Algo salio mal! :("
          ) : (
            <div className="user">
              <img src={data.img || "/img/noavatar.jpg"} alt="" />
              <span>{data.name}</span>
            </div>
          )}
          <t class>{item.title}</t>
          <p>{item.desc.substring(0, 100)+"..."}</p>
        </div>

       
        <hr />
        <div className="detail">
          <div className="star">
              <img src="./img/star.png" alt="" />
              <span>
                {!isNaN(item.totalStars / item.starNumber) &&
                  Math.round(item.totalStars / item.starNumber)}
              </span>
          </div>
            <div className="price">
              <span>Precio</span>
              <p>$ {item.price}</p>
            </div>
        </div>
      </div> 
    </Link>
  );
};
export default GigCard;