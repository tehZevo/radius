import axios from "axios";
import { createHelia } from 'helia'
import { json } from '@helia/json'
import { unixfs } from '@helia/unixfs'
import { createHeliaHTTP } from '@helia/http'
import { strings } from '@helia/strings'
import { trustlessGateway } from '@helia/block-brokers'
import { delegatedHTTPRouting } from '@helia/routers'
import { CID } from 'multiformats/cid'
import { concat } from "uint8arrays/concat"

//TODO: dont hardcode
const API_URL = "http://127.0.0.1:8123"

const config = { headers: { "Content-Type": "application/json" } };

var helia = null
var heliaJson = null

export async function getHelia() {
  if (heliaJson == null) {

    // helia = await createHelia()
    helia = await createHeliaHTTP()
    // {
    //   blockBrokers: [
    //     trustlessGateway({
    //       gateways: ['https://cloudflare-ipfs.com', 'https://ipfs.io'],
    //     }),
    //   ],
    //   routers: [
    //     delegatedHTTPRouting('https://delegated-ipfs.dev')
    //   ]
    // })
    heliaJson = unixfs(helia)
  }

  return heliaJson;
}


export async function read(cid) {
  const fs = await getHelia()
  cid = CID.parse(cid)

  const arrays = []
  for await (const buf of fs.cat(cid)) {
    arrays.push(buf)
  }

  return concat(arrays)
}

export async function readJson(cid) {
  return JSON.parse(new TextDecoder().decode(await read(cid)))
}

function ppcl(route: string, data = null) {
  return axios.post(API_URL + "/" + route, data, config).then(e => e.data)
}

//account/login
export const getIdentities = () => ppcl("getIdentities")
export const account = () => ppcl("account")
export const login = (name, password) => ppcl("login", { name, password })
export const logout = () => ppcl("logout")
export const getClientId = () => ppcl("getClientId")

//profile
export const setName = (name) => ppcl("setName", name)
export const wipe = (sure) => ppcl("wipe", sure)

//social data/actions
export const getProfile = (id) => ppcl("getProfile", id)
export const getFeed = () => ppcl("getFeed")
export const follow = (id) => ppcl("follow", id)
export const post = (content, attachments = []) => ppcl("post", { content, attachments })
export const getRecommended = () => ppcl("getRecommended")
export const isFollowing = (follower, followee) => ppcl("isFollowing", { follower, followee })

//files
export const getFile = (cid) => ppcl("getFile", cid)

//configuration
export const getRadius = () => ppcl("getRadius")
export const setRadius = (radius) => ppcl("setRadius", radius)

