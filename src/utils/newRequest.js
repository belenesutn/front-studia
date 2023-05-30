import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://api.studia.ar/api/",
  withCredentials: true,
  headers: {'Access-Control-Allow-Origin': true, 'Content-Type': 'application/json'}
  });
export default newRequest;
