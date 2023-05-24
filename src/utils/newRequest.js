import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://studia-utn.uc.r.appspot.com/api/",
  withCredentials: true,
});

export default newRequest;
