import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import * as radius from "../services/radius"

export default function CreatePost()
{
  const {userId} = useParams()
  const [profile, setProfile] = useState()
  
  async function fetchProfile()
  {
    console.log(userId)
    const profile = await radius.getProfile(userId)
    setProfile(profile)
  }
  
  async function follow()
  {
    await radius.follow(userId)
  }
  
  //TODO: avoid double render
  useEffect(() => {
    fetchProfile()
  }, [])

  
  return (
    <div>
      {profile ? (
        <>
          <p>Name: {profile.name}</p>
          <p>User id: {userId}</p>
          <p>Following:</p>
          <div>{profile.following.map(e => <p key={e}>{e}</p>)}</div>
          <p>Posts:</p>
          <div>{profile.public_posts.map(e => <p>{e}</p>)}</div>
          <button onClick={follow}>Follow</button>
        </>
      ) : <p>You aren't logged in...</p>}
    </div>
  )
}