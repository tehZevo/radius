import axios from "axios";
import * as ipfs from "./ipfs"

var currentAccount = null

const DEFAULT_PUBLISH_OPTIONS = {lifetime: "24h"}
const DEFAULT_RESOLVE_OPTIONS = {
  nocache: true,
  recordCount: 5,
  timeout: "5s"
}

export const getPost = async (postId) => await ipfs.readJson(postId)

export const getProfile = async (userId) =>
{
  const cid = await ipfs.resolve(userId, DEFAULT_RESOLVE_OPTIONS)
  const profile = await ipfs.readJson(cid)
  return profile
}

//TODO: isFollowing, isInRadius, getDistance


//TODO: dont hardcode
const API_URL = "http://127.0.0.1:8123"

const config = { headers: { "Content-Type": "application/json" } };

function ppcl(route: string, data = null) {
  return axios.post(API_URL + "/" + route, data, config).then(e => e.data)
}

// class Client
// {
//   //TODO: should we provide ipfs node api to client?
//   constructor()
//   {
//     this.accounts = []
//   }

//   //TODO: load account from local storage
//   import()
// }

// class Account
// {
//   constructor()
//   {
//     this.profile = null
//   }

//   login()
//   {
    
//   }
// }

const ACCOUNT_STORAGE_KEY = "radiusAccounts"

export function getAccounts()
{
  return JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY)) ?? {}
}

export async function importAccount(name, identity)
{
  const accounts = getAccounts()
  
  //TODO: check if name already exists
  accounts[name] = identity

  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts))

  console.log("accounts after importing:", getAccounts())
}

//TODO: add identity generation on client side

//TODO: move imported identities to localstorage

//account/login
export const getIdentities = () => ppcl("getIdentities")
export const account = () => ppcl("account")
// export const login = (name, password) => ppcl("login", { name, password })
export const logout = () => ppcl("logout")
export const getClientId = () => ppcl("getClientId")

//profile
export const setName = (name) => ppcl("setName", name)
export const wipe = (sure) => ppcl("wipe", sure)

//social data/actions
// export const getProfile = (id) => ppcl("getProfile", id)
// export const getFeed = () => ppcl("getFeed")
export const follow = (id) => ppcl("follow", id)
export const post = (content, attachments = []) => ppcl("post", { content, attachments })
// export const getRecommended = () => ppcl("getRecommended")
export const isFollowing = (follower, followee) => ppcl("isFollowing", { follower, followee })

//files
// export const getFile = (cid) => ppcl("getFile", cid)
export const getFile = (cid) => ipfs.readBytes(cid)

//configuration
export const getRadius = () => ppcl("getRadius")
export const setRadius = (radius) => ppcl("setRadius", radius)


export function login(name, password)
{
  //load key
  const accounts = getAccounts()
  //TODO: check if exists
  const account = accounts[name]
  
}


///
//BFS search
//TODO: allow a cache to be passed in so they arent refetched?
export async function fetchProfilesInRadius(startId, radius)
{
  const explored = new Set()
  const profiles = {}
  const horizon = [[startId, 0]] //id, distance
  
  while(horizon.length > 0)
  {
    const [id, distance] = horizon.shift() //explore first
    //TODO: better handling of failed profile resolve
    const profile = await getProfile(id)
      .catch((e) => console.error("Failed to fetch profile " + id, e))
        
    profiles[id] = {
        "profile": profile,
        "distance": distance
    }
    explored.add(id)
    
    for(var nextId of profile.following)
    {
      //skip already explored and neighbors with too high of a distance
      if(explored.has(nextId) || distance + 1 > radius)
      {
        continue
      }
      
      horizon.push([nextId, distance + 1])
    }
  }
  return profiles
}

export async function getRecommended(userId, radius)
{
  const profiles = fetchProfilesInRadius(userId, radius)
  //filter out ourselves and people we already follow
  let recommended = Object.entries(profiles).filter(([id, p]) => p.distance > 1)
  recommended = recommended.map(([id, p]) => [id, p.profile, p.distance])
  console.log(recommended)
  //TODO: calculate score
  //TODO: sort (with score)
  recommended = recommended.map(([id, p, dist]) => [id, p, dist, 0])
  
  return recommended
}

interface Author
{
  id: string
  name: string
  distance: number
}


interface PostIdWithAuthor
{
  postId: string
  author: Author
}

export async function getPublicFeed(userId, radius)
{
  //TODO: filter self posts?
  const profiles = Object.values(await fetchProfilesInRadius(userId, radius))
  
  const posts: PostIdWithAuthor[] = []
  for(var profile of profiles)
    for(var postId of profile.profile.public_posts)
    {
      console.log(postId, profile)
      posts.push({
        postId,
        author: {
          //TODO: verify id
          id: profile.profile.id,
          name: profile.profile.name,
          distance: profile.distance
        }
      })
    }
          
  return posts
}