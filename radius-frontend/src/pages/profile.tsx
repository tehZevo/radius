import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import * as radius from "../services/radius"
import Post from "../components/post"
import Box from "../components/box"

export default function CreatePost()
{
  const {userId} = useParams()
  const [profile, setProfile] = useState()
  
  const distance = null //TODO: we don't know this.. need to return from BE
  
  async function fetchProfile()
  {
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
    <Box direction="column" raised={false}>
      {profile ? (
        <>
          <Box raised={false}>
            <Box>{profile.name} ({userId})</Box>
            <Box>Distance: {distance ?? "unknown"}</Box>
            <button onClick={follow}>Follow</button>
          </Box>
          <Box direction="column">
            <span>Following:</span>
            {profile.following.map(e => <Box key={e}>{e}</Box>)}
          </Box>
          <Box direction="column">
            <span>Posts:</span>
            <div>{profile.public_posts.map(e => <Post post={e}/>)}</div>
          </Box>
        </>
      ) : <span>Loading...</span>}
    </Box>
  )
}