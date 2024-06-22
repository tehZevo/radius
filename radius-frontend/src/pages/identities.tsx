import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import * as radius from "../services/radius"

export default function Identities()
{
  const [identities, setIdentities] = useState([])
  const navigate = useNavigate();
  
  async function fetchIdentities()
  {
    const identities = await radius.getIdentities()
    console.log(identities)
    setIdentities(identities)
  }
  
  //TODO: avoid double render
  useEffect(() => {
    fetchIdentities()
  }, [])
  
  function login(name: string)
  {
    navigate("/login", {state: {"identity": name}})
  }
  
  return (
    <>
      <div>
        {identities.map(e => <button key={e} onClick={() => login(e)}>{e}</button>)}
      </div>
    </>
  )
}