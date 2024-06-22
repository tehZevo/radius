import { useState, useEffect } from 'react'
import * as radius from "../services/radius"

export default function Profile()
{
  const [profile, setProfile] = useState()
  const [clientId, setClientId] = useState()
  
  async function fetchProfile()
  {
    const profile = await radius.getProfile()
    const clientId = await radius.getClientId()
    setProfile(profile)
    setClientId(clientId)
  }
  
  //TODO: avoid double render
  useEffect(() => {
    fetchProfile()
  }, [])

  
  return (
    <div>
      {profile ? (
        <>
          <p>I am {clientId}</p>
          <p>I'm following</p>
          <p>{profile.following.map(e => <p key={e}>{e}</p>)}</p>
          <p>My posts</p>
          <p>{profile.public_posts.map(e => <p>{e}</p>)}</p>
        </>
      ) : <p>You aren't logged in...</p>}
    </div>
  )
}