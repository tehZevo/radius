import { useState, useEffect } from 'react'
import * as radius from "../services/radius"

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

  
  return (
    <div>
        <>
          {feed.map(e => <p key={e}>{e}</p>)}
        </>
    </div>
  )
}