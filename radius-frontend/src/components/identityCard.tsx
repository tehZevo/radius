import { useNavigate } from "react-router-dom";
import Box from "./box"
import Avatar from "./profile/avatar"

export default function IdentityCard({name, id})
{
  const navigate = useNavigate()
  
  function login()
  {
    navigate("/login", {state: {"identity": name}})
  }
  
  //TODO: get id from server
  return (
    <>
      <Box>
        <Avatar userId={id} />
        <span>{name}</span>
        <span>{id}</span>
        <button onClick={() => login()}>Login</button>
      </Box>
    </>
  )
}
