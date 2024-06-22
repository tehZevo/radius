import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import * as radius from "../services/radius"

export default function CreatePost()
{
  const navigate = useNavigate();
  
  async function onSubmit(e)
  {
    e.preventDefault()
    const formData = new FormData(e.target)
    const content = formData.get("content")
    //TODO: return post id and then navigate to single post
    await radius.post(content)
    
    const clientId = await radius.getClientId()
    navigate("/profile/" + clientId)
  }
  
  return (
    <div>
      <form onSubmit={onSubmit}>
        <p>Write something cool...</p>
        <input name="content" type="text" required />
        <button type="submit">Post</button>
      </form>
    </div>
  )
}