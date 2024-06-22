import Box from "./box"
import RadiusSlider from "./radiusSlider"
import Recommended from "./recommended"

export default function FeedSidebar() {
  
  return (
    <Box raised={false} direction="column">
      <RadiusSlider />
      <Recommended />
    </Box>
  );
}
