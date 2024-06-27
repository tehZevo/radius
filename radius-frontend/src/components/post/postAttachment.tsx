import {useState, useEffect} from "react"
import {encode} from "base64-arraybuffer"
import * as radius from "../../services/radius"

const MIME_TYPES = {
  "gif": "image/gif",
  "png": "image/png",
  "jpg": "image/jpg",
  "jpeg": "image/jpg",
}

export default function PostAttachment({attachment})
{
  const [data, setData] = useState()
  
  async function fetchData()
  {
    const data = await radius.getFile(attachment.cid)
    setData(data)
  }
  
  useEffect(() =>
  {
    fetchData()
  }, [attachment])
  
  //TODO: fetch data?
  if(attachment.name.endsWith(".jpg") || attachment.name.endsWith(".png") || attachment.name.endsWith(".jpeg"))
  {
    if(data == null)
    {
      return <span>Loading...</span>
    }
    const extension = attachment.name.split(".").slice(-1)[0]
    const mimeType = MIME_TYPES[extension]
    const dataEncoded = encode(data)
    return data ? <img width="128" src={"data:" + mimeType + ";base64," + dataEncoded} /> : "Loading..."
  }
  else
  {
    //TODO
    return <span>idk what this is</span>
  }
}
