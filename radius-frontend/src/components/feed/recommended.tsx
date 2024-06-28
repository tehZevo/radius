import Box from "../box"
import {useRadius} from "../../hooks/radiusHooks"
import RecommendedCard from "./recommendedCard"

export default function Recommended() {
  const {useRecommended, useAccount} = useRadius()
  const account = useAccount()
  const recommended = useRecommended(account, 3) //TODO: dont hardcode radius
  
  return (
    <>
      <Box raised={false} direction="column">
        {recommended.map(e => {
          const {id, profile, distance, score} = e
          
          return <RecommendedCard
            id={id}
            profile={profile}
            distance={distance}
            score={score}
          />
        })}
      </Box>
    </>
  );
}
