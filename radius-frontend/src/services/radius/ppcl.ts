import axios from "axios";

//TODO: remove ppcl/axios
const API_URL = "http://127.0.0.1:8123"

const ppclConfig = { headers: { "Content-Type": "application/json" } };

export default function ppcl(route: string, data = null) {
  return axios.post(API_URL + "/" + route, data, ppclConfig).then(e => e.data)
}
