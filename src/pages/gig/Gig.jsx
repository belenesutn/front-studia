import React, { useReducer, useState } from "react";
import "./Gig.scss";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";
import Modal from 'react-modal';
import { classReducer, INITIAL_STATE } from "../../reducers/classReducer";
import { useNavigate } from "react-router-dom";
import getCurrentUser from "../../utils/getCurrentUser";
import Review from "../../components/review/Review";

function Gig() {
  const { id } = useParams();


const { isLoading, error, data } = useQuery({
    queryKey: ["gig"],
    queryFn: () =>
      newRequest.get(`/gigs/${id}`).then((res) => {
        return res.data;
      }),
  });

  const  {isLoading: isLoadingClass, error: errorClass, data:clase} = useQuery({
    queryKey: ["class"],
    queryFn: () =>
      newRequest.get(`/class/${id}`).then((res) => {
        return res.data;
      }),
  });

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      height: '300px ',
      width: '300px',
      display:'flex',
      flexDirection:'column',
      ariaHideApp: false
    },
  };

  const userId = data?.userId;
  const schedule = data?.schedule;

  const currentUser = getCurrentUser();

  console.log(schedule);


  const isFinalizada = clase?.some(
    review => review.state === "FINALIZADA" && review.studentId === currentUser._id);
 
    const { isLoading: isLoadingClass2, error: errorClass2, data: reviews } = useQuery({
      queryKey: ["reviews"],
      queryFn: () =>
        newRequest.get(`/reviews/${id}`).then((res) => {
          return res.data;
        }),
    });

    const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      newRequest.get(`/users/${userId}`).then((res) => {
        return res.data;
      }),
    enabled: !!userId,
  });

  const [state, dispatch] = useReducer(classReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload) => {
      return newRequest.post(`/class/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["class"]);
    },
  });

  const mutation2 = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/messages`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      gigId: id,
      img: data?.image,
      title: data?.title,
      price: data?.price,
      tutorId: data?.userId,
      studentId: currentUser._id,
      dayselected: state.dayselected,
      descselected: state.descselected,
    };

    const tutorId = data?.userId;
    const studentId = currentUser._id
    const id2 = tutorId + studentId;
    
    mutation.mutate(payload);
 
    try {
      const res = await newRequest.get(`/conversations/single/${id2}`);
      navigate(`/message/${id2}`);
    } catch (err) {
      if (err.response.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.isTutor ? studentId : tutorId,
        });}}
    mutation2.mutate({ conversationId: id2,  desc:state.descselected}),
      
    navigate(`/message/${id}`);
  };

    const [isOpen, setIsOpen] = useState(false);
  
    const handleOpenModal = () => {
      if (!currentUser?.isTutor) {
        setIsOpen(true);
      } else {
        alert("Un tutor no puede reservar clases.");
      }
    };
  
    const handleCloseModal = () => {
      setIsOpen(false);
    };
 
     
  return (
    <div className="gig">
      {isLoading ? (
        "Cargando"
      ) : error ? (
        "Algo salio mal! :("
      ) : (
        <div className="container">
          <div className="left">
            <span className="breadcrumbs">
              Studia {">"} 
            </span>
            <h1>{data.title}</h1>
            {isLoadingUser ? (
              "Cargando"
            ) : errorUser ? (
              "Algo salio mal! :("
            ) : (
              <div className="user">
                <img
                  className="pp"
                  src={dataUser.img || "/img/noavatar.jpg"}
                  alt=""
                />
                <span>{dataUser.username}</span>
                {!isNaN(data.totalStars / data.starNumber) && (
                  <div className="stars">
                    {Array(Math.round(data.totalStars / data.starNumber))
                      .fill()
                      .map((item, i) => (
                        <img src="/img/star.png" alt="" key={i} />
                      ))}
                    <span>{Math.round(data.totalStars / data.starNumber)}</span>
                  </div>
                )}
              </div>
            )}
            <div className="slider">
             <img src={data.image} alt="" />
            </div>
            <h3>Acerca de esta Clase</h3>
            <p>{data.desc}</p>
            {isLoadingUser ? (
              "Cargando"
            ) : errorUser ? (
              "Algo salio mal! :("
            ) : (
              <div className="seller">
                <h3>Sobre el Tutor</h3>
                <div className="user">
                  <img src={dataUser.img || "/img/noavatar.jpg"} alt="" />
                  <div className="info">
                    <span>{dataUser.username}</span>
                    {!isNaN(data.totalStars / data.starNumber) && (
                      <div className="stars">
                        {Array(Math.round(data.totalStars / data.starNumber))
                          .fill()
                          .map((item, i) => (
                            <img src="/img/star.png" alt="" key={i} />
                          ))}
                        <span>
                          {Math.round(data.totalStars / data.starNumber)}
                        </span>
                      </div>
                    )}
                    <Link to={`/message/${id2}`}>
                    <button>Contactarme</button>
                    </Link>
                  </div>
                </div>
                <div className="box">
                  <div className="items">
                    <div className="item">
                      <span className="title">De</span>
                      <span className="desc">{dataUser.country}</span>
                    </div>
                    <div className="item">
                      <span className="title">Miembro desde</span>
                      <span className="desc">2023</span>
                    </div>
                    <div className="item">
                      <span className="title">Idioma</span>
                      <span className="desc">Español</span>
                    </div>
                  </div>
                  <hr />
                  <p>{dataUser.desc}</p>
                </div>
              </div>
            )}
                <div className="reviews">
                  <h3>Reseñas</h3>
                    {reviews?.map((review) => <Review key={review._id} review={review} />)}
                  </div>
             {isFinalizada && <Reviews gigId={id} />}
          </div>
          <div className="right">
            <div className="price">
              <div>
              <h3>{data.title}</h3>
              <h3 style={{ display: "flex", flexDirection: "column" }}>
                {data.isOnline ? <h5>Virtual</h5> : <h4>Presencial</h4>}
              </h3>
              </div>
              <div>
              <h3>$ {data.price}</h3>
              </div>
            </div>
            <p>{data.shortDesc}</p>
            <div className="features">
              <div className="item">
                
                <img src="/img/clock.png" alt="" />
                <p>Horarios</p>
                
                <div className="2">
                  {data.schedule.map((schedule) => (
                  <div className="item" key={schedule}>
                    <img src="/img/check.png" alt="" />
                    <span>{schedule}</span>
                  </div>))}
                </div>
                </div>
            </div> 
            <div className="features">
              <p>Temas:</p>
              {data.topics.map((topics) => (
                <div className="item" key={topics}>
                  <img src="/img/greencheck.png" alt="" />
                  <span>{topics}</span>
                </div>
              ))}
            </div>
            <div>
                  <button onClick={handleOpenModal}>Reservar</button>
        <Modal isOpen={isOpen}   style={customStyles} onRequestClose={handleCloseModal}>
          <div>
          <h2>Completar campos</h2>
          </div>
          <form>
            <div className="select2">
                
                <label>Horario:</label>
                <select name="dayselected" onClick={handleChange}>
                <option value=""></option>
                {schedule.map((dia, index) => (
                      <option key={index}  value={dia}>{dia}</option>
                    ))}
                </select>
              </div>
              <div className="desc">
                <label >Escribe un mensaje para el Tutor:</label>
                <textarea type="text" resize= 'none' id="descselected" name="descselected" onChange={handleChange}  cols="0" rows="6"/>
              </div>
                <button onClick={handleSubmit} className="botoncito">Reserva!</button>
          </form>
        </Modal>
      </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gig;