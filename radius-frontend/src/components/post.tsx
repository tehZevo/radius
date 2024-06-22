import { useNavigate } from 'react-router-dom';
import Box from "./box"

export default function Post({post, author})
{
  const navigate = useNavigate()
  // const {post, author} = postWithAuthor
  // console.log(postWithAuthor)
  
  const authorInfo = author ? (
    <Box raised={false}>
      <a href={`/profile/${author.id}`}>{author.name}</a> ({author.id})
      <span>Distance: {author.distance ?? "unknown"}</span>
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