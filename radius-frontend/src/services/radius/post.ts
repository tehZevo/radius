import makeIpfs from "./ipfsUtils"
import * as account from "./account"

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
}

export const getPost = async (postId) => await makeIpfs().readJson(postId)

export const getFile = (cid) => makeIpfs().readBytes(cid)

export async function createPost(content, attachments=[])
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
    timestamp: Math.floor(Date.now() / 1000)
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