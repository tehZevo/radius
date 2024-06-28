import Box from "./box"
import {useAccount} from "../hooks/radiusHooks"

export default function TopBar() {
  const userId = useAccount()
  
  return (
    <Box raised={false}>
      <Box><div style={{fontWeight: "bold"}}>Radius</div></Box>
      <Box><a href={"/radius"}>Identities</a></Box>
      <Box><a href="/radius/feed">Feed</a></Box>
      <Box><a href={`/radius/profile/${userId}`}>Profile</a></Box>
      <Box><a href="/radius/create-post">Create post</a></Box>
      <Box><a href="/radius/settings">Settings</a></Box>
    </Box>
  );
}
