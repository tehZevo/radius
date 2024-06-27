import { useParams } from 'react-router-dom'
import { useRadius } from "../hooks/radiusHooks"

import Post from "../components/post/post"
import Box from "../components/box"
import FollowButton from "../components/profile/followButton"

export default function Profile() {
  const { userId } = useParams()
  const { useProfile } = useRadius()
  const profile = useProfile(userId)

  const distance = null //TODO: we don't know this.. need to return from BE

  //TODO: need a second post type that resolves based on CID in FE?
  return (
    <Box direction="column" raised={false}>
      {profile ? (
        <>
          <Box raised={false}>
            <Box>{profile.name} ({userId})</Box>
            <Box>Distance: {distance ?? "unknown"}</Box>
            <FollowButton userId={userId} />
          </Box>
          <Box direction="column">
            <span>Following:</span>
            {profile.following.map(e => <Box key={e}>{e}</Box>)}
          </Box>
          <Box direction="column">
            <span>Posts:</span>
            <div>{profile.publicPosts.map(e => <Post key={e} postId={e} />)}</div>
          </Box>
        </>
      ) : <span>Loading...</span>}
    </Box>
  )
}