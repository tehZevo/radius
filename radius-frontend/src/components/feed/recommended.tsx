import Box from "../box"
import {useRecommended} from "../../hooks/radiusHooks"
import RecommendedCard from "./recommendedCard"

export default function Recommended() {
  const recommended = useRecommended([])
  
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
