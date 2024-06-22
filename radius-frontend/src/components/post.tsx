import Box from "./box"
import DistanceIcon from "./distanceIcon"
import Avatar from "./avatar"

export default function Post({post, author})
{
  const authorInfo = author ? (
    <Box raised={false}>
      <Avatar userId={author.id} />
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