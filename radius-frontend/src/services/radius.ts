import axios from "axios";
import * as ipfs from "./ipfs"
import * as keys from "./keys"

//TODO: add resolveAfterPublish = false default
const DEFAULT_PUBLISH_OPTIONS = {lifetime: "24h", resolve: false}
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

export const IDENTITIES_STORAGE_KEY = "radiusAccounts"
export const CURRENT_PROFILE_STORAGE_KEY = "radiusCurrentProfile"
export const CURRENT_ACCOUNT_STORAGE_KEY = "radiusCurrentAccount"

export function getIdentities()
{
  return JSON.parse(localStorage.getItem(IDENTITIES_STORAGE_KEY)) ?? {}
}

export function getCurrentProfile()
{
  return JSON.parse(localStorage.getItem(CURRENT_PROFILE_STORAGE_KEY))
}

export function getCurrentAccount()
{
  return JSON.parse(localStorage.getItem(CURRENT_ACCOUNT_STORAGE_KEY))
}

export function saveCurrentProfile(profile)
{
  localStorage.setItem(CURRENT_PROFILE_STORAGE_KEY, JSON.stringify(profile))
}

export function saveCurrentAccount(account)
{
  localStorage.setItem(CURRENT_ACCOUNT_STORAGE_KEY, JSON.stringify(account))
}

export async function importAccount(name, id, key)
{
  const accounts = getIdentities()
  
  //TODO: check if name already exists
  accounts[name] = {name, id, key}

  localStorage.setItem(IDENTITIES_STORAGE_KEY, JSON.stringify(accounts))

  console.log("accounts after importing:", getIdentities())
}

//TODO: add identity generation on client side

//TODO: move imported identities to localstorage

//account/login
// export const getIdentities = () => ppcl("getIdentities")
// export const login = (name, password) => ppcl("login", { name, password })
export const logout = () => ppcl("logout")
export const getUserId = () => getCurrentProfile().id

//profile
export const setName = (name) => ppcl("setName", name)
export const wipe = (sure) => ppcl("wipe", sure)

//social data/actions
// export const getProfile = (id) => ppcl("getProfile", id)
// export const getFeed = () => ppcl("getFeed")
export const follow = (id) => ppcl("follow", id)
// export const post = (content, attachments = []) => ppcl("post", { content, attachments })
// export const getRecommended = () => ppcl("getRecommended")
export const isFollowing = (follower, followee) => ppcl("isFollowing", { follower, followee })

//files
// export const getFile = (cid) => ppcl("getFile", cid)
export const getFile = (cid) => ipfs.readBytes(cid)

//configuration
export const getRadius = () => ppcl("getRadius")
export const setRadius = (radius) => ppcl("setRadius", radius)

export async function createPost(content, attachments=[])
{
  // console.log("Posting message...")
  // //convert attachments to bytes
  // //TODO: reenable attachments
  // // attachments = [(
  // //     attachment["name"],
  // //     base64.b64decode(attachment["data"])
  // // ) for attachment in data["attachments"]]
  // currentProfile.posts.push()
  // client.make_public_post(data["content"], attachments)
  // print("Done.")

  //if attachments, upload all to ipfs first
  //TODO: catch failures
  // if len(attachments) > 0:
  //     print("Uploading", len(attachments), "attachments...")
  const uploaded_attachments = []
  // for name, data in attachments:
  //     print("Uploading", name, "...")
  //     cid = write(name, data)
  //     uploaded_attachments.append(Attachment(name, cid))
  //upload post to ipfs
  const post = {
    content,
    attachments: uploaded_attachments,
    timestamp: Math.floor(Date.now() / 1000)
  }
  const postCid = await ipfs.writeJson(post)

  //fetch current profile from localstorage
  const profile = getCurrentProfile()
  const account = getCurrentAccount()
  
  //save post cid in profile
  profile.publicPosts.push(postCid)

  await saveProfile(account, profile)

  saveCurrentProfile(profile)

  return postCid
}

export async function saveProfile(keyName, profile)
{
  const cid = await ipfs.writeJson(profile)
  return ipfs.publish(keyName, cid, DEFAULT_PUBLISH_OPTIONS)
}

interface Profile
{
  id: string //TODO: verify this or inject it since we SHOULD already know it
  name: string
  publicPosts: Post[]
  // privatePosts: ??? //TODO
  following: string[]
}

export async function login(name, password)
{
  //load key
  const accounts = getIdentities()
  //TODO: check if exists first
  const {id, key} = accounts[name]
  //decrypt key
  const decryptedKey = await keys.decryptIpfsKey(key, password)

  //import key into ipfs
  ipfs.removeKey(name)
  ipfs.importKey(name, decryptedKey)
  saveCurrentAccount(name)
  
  var profile: Profile
  try
  {
    profile = await getProfile(id)
  }
  //TODO: dont swallow all exceptions
  catch
  {
    profile = {
      id,
      name: "Anonymous",
      publicPosts: [],
      following: []
    }
    await saveProfile(name, profile)
  }

  saveCurrentProfile(profile)
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

interface Attachment
{
  name: string
  cid: string
  //size: int #TODO, also #TODO: validate
  //TODO: thumbnails/previews?
}
    
interface Post
{
  content: string
  attachments: Attachment[]
  timestamp: number
}

export async function getPublicFeed(userId, radius)
{
  //TODO: filter self posts?
  const profiles = Object.values(await fetchProfilesInRadius(userId, radius))
  
  const posts: PostIdWithAuthor[] = []
  for(var profile of profiles)
    for(var postId of profile.profile.publicPosts)
    {
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