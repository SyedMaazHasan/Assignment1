import axios from "axios";
const apiEndPoint = "http://localhost:4000";
function getData() {
  const resu = axios.get(apiEndPoint + "/get");

  return resu;
}

export default getData;
