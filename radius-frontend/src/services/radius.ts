import axios from 'axios';

//TODO: dont hardcode
const API_URL = "http://127.0.0.1:8123"

function ppcl(route: string, data = null)
{
  return axios.post(API_URL + "/" + route, data).then(e => e.data)
}

export const getIdentities = () => ppcl("getIdentities")

export const login = (name, password) => ppcl("login", {name, password})

export const logout = () => ppcl("logout")

export const getProfile = () => ppcl("getProfile")

export const getClientId = () => ppcl("getClientId")