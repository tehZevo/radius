import axios from 'axios';

//TODO: dont hardcode
const API_URL = "http://127.0.0.1:8123"

const config = { headers: {'Content-Type': 'application/json'} };

function ppcl(route: string, data = null)
{
  return axios.post(API_URL + "/" + route, data, config).then(e => e.data)
}

export const getIdentities = () => ppcl("getIdentities")

export const login = (name, password) => ppcl("login", {name, password})

export const logout = () => ppcl("logout")

export const getProfile = (id) => ppcl("getProfile", id)

export const getClientId = () => ppcl("getClientId")

export const setName = (name) => ppcl("setName", name)

export const getFeed = () => ppcl("getFeed")

export const follow = (id) => ppcl("follow", id)

export const post = (content) => ppcl("post", content)

export const wipe = (sure) => ppcl("wipe", sure)

export const account = () => ppcl("account")

export const getRecommended = () => ppcl("getRecommended")