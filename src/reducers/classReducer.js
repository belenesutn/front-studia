export const INITIAL_STATE = {
    studentId: JSON.parse(localStorage.getItem("currentUser"))?._id,
    gigId: "",
    img: "",
    title: "",
    price: "",
    tutorId: "",
    descselected: "",
    dayselected: "",
    state: "CREADA"
  };
  
  export const classReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_INPUT":
        return {
          ...state,
          [action.payload.name]: action.payload.value,
        };
      case "ADD_IMAGE":
        return {
          ...state,
          image: action.payload.image,
        };
      default:
        return state;
    }
  };