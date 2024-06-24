import { useState, useEffect } from 'react'
import * as radius from "../services/radius"
import Post from "../components/post/post"
import Box from "../components/box"
import FeedSidebar from "../components/feed/feedSidebar"

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
    <Box raised={false}>
      <Box raised={false} direction="column">
        {feed.map(e => {
          const {post, author} = e;
          return <Post post={post} author={author} />
        })}
      </Box>
      <FeedSidebar />
    </Box>
  )
}