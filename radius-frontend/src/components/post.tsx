import { useNavigate } from 'react-router-dom';
import Box from "./box"
import DistanceIcon from "./distanceIcon"

export default function Post({post, author})
{
  const navigate = useNavigate()
  // const {post, author} = postWithAuthor
  // console.log(postWithAuthor)
  
  const authorInfo = author ? (
    <Box raised={false}>
      <a href={`/profile/${author.id}`}>{author.name}</a> ({author.id})
      <DistanceIcon distance={author.distance} />
    </Box>
  ) : null
  
  return (
    <>
      <Box direction="column">
        {authorInfo}
        <span>{post.content} ({post.timestamp})</span>
      </Box>
    </>
  )
}