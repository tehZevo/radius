import makeIpfs from "./ipfsUtils"
import * as config from "./config"
import {Post} from "./post"

export interface Profile
{
  id: string //TODO: verify this or inject it since we SHOULD already know it
  name: string
  publicPosts: Post[]
  // privatePosts: ??? //TODO
  following: string[] //TODO: validate this is a set
}

export const getProfile = async (userId) =>
{
  const ipfs = makeIpfs()
  const cid = await ipfs.resolve(userId, config.DEFAULT_RESOLVE_OPTIONS)
  return await ipfs.readJson(cid)
}

export function createNewProfile(id: string): Profile
{
  return {
    id,
    name: "Anonymous",
    publicPosts: [],
    following: []
  }
}



