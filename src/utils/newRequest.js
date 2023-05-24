import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://studia-utn.uc.r.appspot.com/api/",
  withCredentials: true,
  headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
  });
export default newRequest;
