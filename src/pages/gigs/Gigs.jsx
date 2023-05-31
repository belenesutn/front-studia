import React, { useEffect, useRef, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import {QueryClient, useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation,  useNavigate } from "react-router-dom";

const queryClient = new QueryClient()

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();
  const { search } = useLocation();
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs"],
    queryFn: () =>
      newRequest
        .get(
          `/gigs${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
        )
        .then((res) => {
          return res.data;
        }),
  });

  console.log(data);

  const handleSubmit = () => {
    navigate(`/gigs?search=${input}`);
    location.reload();
  };

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort]);

  const apply = () => {
    refetch();
  };


  return (
      <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">Studia</span>
        <h1>Clases</h1>
        <p>
          Encuentra tu Tutor ideal para tus clases
        </p>
        
        <div className="menu">
          <div className="left">
          <div className="search">
            <div className="searchInput">
              <img src="./img/search.png" alt="" />
              <input type="text" placeholder='Probá "Algebra"' 
                onChange={(e) => setInput(e.target.value)}/>
            <button onClick={handleSubmit}>Buscar</button></div>
        </div>
        <div>
            <span>Precio</span>
            <input ref={minRef} type="number" placeholder="Min" />
            <input ref={maxRef} type="number" placeholder="Max" />
            <button onClick={apply}>Aplicar</button>
          </div>
          </div>
          <div className="right">
            <span className="sortBy">Ordenar</span>
            <span className="sortType">
              {sort === "sales" ? "Mas Vendidas" : "Recientes"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Recientes</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Mas Vendidas</span>
                  )}
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading
            ? "loading"
            : error
            ? "Something went wrong!"
            : data.map((gig) => <GigCard key={gig._id} item={gig} />)}
        </div>
      </div>
    </div>
  );
}

export default Gigs;