import axios from "axios";

//TODO: dont hardcode
const API_URL = "http://127.0.0.1:8123"

const config = { headers: {"Content-Type": "application/json"} };

function ppcl(route: string, data = null)
{
  return axios.post(API_URL + "/" + route, data, config).then(e => e.data)
}

//account/login
export const getIdentities = () => ppcl("getIdentities")
export const account = () => ppcl("account")
export const login = (name, password) => ppcl("login", {name, password})
export const logout = () => ppcl("logout")
export const getClientId = () => ppcl("getClientId")

//profile
export const setName = (name) => ppcl("setName", name)
export const wipe = (sure) => ppcl("wipe", sure)

//social data/actions
export const getProfile = (id) => ppcl("getProfile", id)
export const getFeed = () => ppcl("getFeed")
export const follow = (id) => ppcl("follow", id)
export const post = (content, attachments=[]) => ppcl("post", {content, attachments})
export const getRecommended = () => ppcl("getRecommended")
export const isFollowing = (follower, followee) => ppcl("isFollowing", {follower, followee})

//files
export const getFile = (cid) => ppcl("getFile", cid)

//configuration
export const getRadius = () => ppcl("getRadius")
export const setRadius = (radius) => ppcl("setRadius", radius)

