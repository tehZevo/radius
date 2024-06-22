import { useState, useEffect } from 'react'
import * as radius from "../services/radius"
import Post from "../components/post"

export default function Feed()
{
  const [feed, setFeed] = useState([])
  
  async function fetchFeed()
  {
    const feed = await radius.getFeed()
    setFeed(feed)
  }
  
  //TODO: avoid double render
  useEffect(() => {
    fetchFeed()
  }, [])

  //TODO: need key for posts
  return (
    <div>
        <>
          {feed.map(e => (
            <Post
              authorId="TODO: need id on post in backend"
              authorProfile={{}}
              post={e}
            />
          ))}
        </>
    </div>
  )
}