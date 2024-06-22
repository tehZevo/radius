import Box from "./box"
import {useAccount} from "../hooks/radiusHooks"

export default function TopBar() {
  const userId = useAccount()
  
  return (
    <>
      <Box raised={false}>
        <Box><a href={"/"}>Identities</a></Box>
        <Box><a href="/feed">Feed</a></Box>
        <Box><a href={`/profile/${userId}`}>Profile</a></Box>
        <Box><a href="/create-post">Create post</a></Box>
        <Box><a href="/settings">Settings</a></Box>
      </Box>
    </>
  );
}
