export const INITIAL_STATE = {
    userId: JSON.parse(localStorage.getItem("currentUser"))?._id,
    title: "",
    cat: "",
    image: "",
    desc: "",
    shortDesc: "",
    schedule: [],
    topics: [],
    price: null,
    isOnline:false,
  };
  
  export const gigReducer = (state, action) => {
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
      case "ADD_topics":
        return {
          ...state,
          topics: [...state.topics, action.payload],
        };
      case "REMOVE_topics":
        return {
          ...state,
          topics: state.topics.filter(
            (topics) => topics !== action.payload
          ),
        };
  
      default:
        return state;
    }
  };