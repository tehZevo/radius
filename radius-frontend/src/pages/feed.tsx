import { useState, useEffect } from 'react'
import * as radius from "../services/radius"
import {useAccount} from "../hooks/radiusHooks"
import Post from "../components/post/post"
import Box from "../components/box"
import FeedSidebar from "../components/feed/feedSidebar"

export default function Feed()
{
  const account = useAccount()
  const [feed, setFeed] = useState([])
  
  useEffect(() => {
    if(account == null)
    {
      return
    }

    //TODO: dont hardcode radius
    radius.getPublicFeed(account, 3).then((f) => setFeed(f))
  }, [account])

  return (
    <Box raised={false}>
      <Box raised={false} direction="column">
        {feed.map(({postId, author}) => <Post key={postId} postId={postId} author={author} />)}
      </Box>
      <FeedSidebar />
    </Box>
  )
}