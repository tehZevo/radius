import { useNavigate } from "react-router-dom";
import Jdenticon from "react-jdenticon"
import Box from "./box"

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
        <Jdenticon size="48" value={id} />
        <span>{name}</span>
        <span>{id}</span>
        <button onClick={() => login()}>Login</button>
      </Box>
    </>
  )
}
