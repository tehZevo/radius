import makeIpfs from "./ipfsUtils"
import * as account from "./account"
import { getPublicFeed, loadRadius } from "."

export interface Author
{
  id: string
  name: string
  distance: number
}

export interface PostIdWithAuthor
{
  postId: string
  author: Author
}

export interface Attachment
{
  name: string
  cid: string
  //size: int #TODO, also #TODO: validate
  //TODO: thumbnails/previews?
}
    
export interface Post
{
  content: string
  attachments: Attachment[]
  timestamp: number
  replyTo: string
}

export async function getPost(postId): Promise<Post>
{
  return await makeIpfs().readJson(postId)
}

export const getFile = (cid) => makeIpfs().readBytes(cid)

export async function getReplies(postId)
{
  //TODO: this is expensive, have to get all known posts
  const radius = loadRadius()
  const userId = account.getCurrentAccount()
  const allPosts = await getPublicFeed(userId, radius)
  const loadedPosts = await Promise.all(allPosts.map(async (e) => [e, await getPost(e.postId)]))
  //TODO: shame we throw away the loaded post (this is because the Post component currently takes an id and loads itself)
  const replies = loadedPosts.filter(([pwa, p]) => p.replyTo == postId).map(([pwa, p]) => pwa)

  return replies
}

export async function createPost(content, attachments=[], replyTo=null)
{
  const ipfs = makeIpfs()
  console.log("Posting message...")

  //if attachments, upload all to ipfs first
  //TODO: catch failures
  //TODO: split out into separate function
  const uploadedAttachments: Attachment[] = []
  if(attachments.length > 0)
  {
    console.log("Uploading", attachments.length, "attachments...")
  
    for(var {name, data} of attachments)
    {
      console.log("Uploading", name, "...")
      const cid = await ipfs.writeBytes(data)
      uploadedAttachments.push({name, cid})
    }
    console.log("Done uploading attachments.")
  }

  //upload post to ipfs
  const post = {
    content,
    attachments: uploadedAttachments,
    timestamp: Math.floor(Date.now() / 1000),
    replyTo
  }
  
  const postCid = await ipfs.writeJson(post)

  //fetch current profile from localstorage
  const profile = account.getCurrentProfile()
  
  //save post cid in profile
  profile.publicPosts.push(postCid)

  await account.saveAndPublishProfile(profile)

  console.log("Done posting message.")

  return postCid
}