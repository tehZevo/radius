import {useState, useEffect} from "react"
import Box from "./box"
import DistanceIcon from "./distanceIcon"
import Avatar from "./avatar"
import * as radius from "../services/radius"


const MIME_TYPES = {
  "gif": "image/gif",
  "png": "image/png",
  "jpg": "image/jpg",
  "jpeg": "image/jpg",
}

function PostAttachment({attachment})
{
  const [data, setData] = useState()
  
  async function fetchData()
  {
    const data = await radius.getFile(attachment.cid)
    setData(data)
    console.log(data)
  }
  
  useEffect(() =>
  {
    fetchData()
  }, [])
  
  //TODO: fetch data?
  if(attachment.name.endsWith(".jpg") || attachment.name.endsWith(".png") || attachment.name.endsWith(".jpeg"))
  {
    if(data == null)
    {
      return <span>Loading...</span>
    }
    const extension = attachment.name.split(".").slice(-1)[0]
    const mimeType = MIME_TYPES[extension]
    return data ? <img width="128" src={"data:" + mimeType + ";base64," + data} /> : "Loading..."
  }
  else
  {
    //TODO
    return <span>idk what this is</span>
  }
}

export default function Post({post, author})
{
  const authorInfo = author ? (
    <Box raised={false}>
      <Avatar userId={author.id} />
      <a href={`/profile/${author.id}`}>{author.name}</a> ({author.id})
      <DistanceIcon distance={author.distance} />
    </Box>
  ) : null
  
  return (
    <>
      <Box direction="column">
        {authorInfo}
        <span>{post.content} ({post.timestamp})</span>
        {post.attachments.map((e) => <PostAttachment attachment={e} />)}
      </Box>
    </>
  )
}