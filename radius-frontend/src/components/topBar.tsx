import Box from "./box"
import {useAccount} from "../hooks/radiusHooks"
import { Link } from "react-router-dom";

export default function TopBar()
{
  const userId = useAccount()
  
  return (
    <Box raised={false}>
      <Box><div style={{fontWeight: "bold"}}>Radius</div></Box>
      <Box><Link to="/">Identities</Link></Box>
      <Box><Link to="/feed">Feed</Link></Box>
      <Box><Link to={`/profile/${userId}`}>Profile</Link></Box>
      <Box><Link to="/create-post">Create post</Link></Box>
      <Box><Link to="/settings">Settings</Link></Box>
    </Box>
  );
}
