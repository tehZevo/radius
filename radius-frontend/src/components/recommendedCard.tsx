import Jdenticon from "react-jdenticon"
import Box from "./box"
import DistanceIcon from "./distanceIcon"
import FollowButton from "./followButton"

export default function RecommendedCard({id, profile, distance, score}) {
  
  return (
    <Box>
      <a href={`/profile/${id}`}><Jdenticon size="48" value={id} /></a>
      <a href={`/profile/${id}`}>{profile.name}</a>
      <DistanceIcon distance={distance} />
      <span>({score})</span>
      <FollowButton userId={id} />
    </Box>
  );
}
