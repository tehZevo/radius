import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import {useDropzone} from 'react-dropzone'
import * as radius from "../services/radius"
import * as keys from "../services/keys"
import IdentityCard from "../components/identityCard"
import {fileToJson} from "../utils/fileUtils"
import Box from "../components/box"

function IdentityDropzone({setIdentity})
{
  const onDrop = async files =>
  {
    var identity = files[0]
    identity = await fileToJson(identity)
    
    setIdentity(identity)
  }
  
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  //TODO: only allow single
  return (
    <Box>
      <div style={{width: "200px", height: "50px", cursor: "pointer"}} {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop identity here...</p> :
            <p>+ Import identity</p>
        }
      </div>
    </Box>
  )
}

function ImportIdentity()
{
  const [identity, setIdentity] = useState()

  async function importIdentity()
  {
    await radius.importAccount(identity)
  }

  return (
    <Box direction="column" raised={true}>
      <IdentityDropzone setIdentity={setIdentity}/>
      {identity ? <button onClick={importIdentity}>Import</button> : null}
    </Box>
  )
}

function CreateIdentity()
{
  async function createIdentity(e)
  {
    e.preventDefault()
    const formData = new FormData(e.target)
    const name = formData.get("name")
    const password = formData.get("password")
    
    const [key, salt, nonce] = await keys.generateIdentity(password)
    
    await radius.importAccount(name, {key, salt, nonce})
    // await ipfs.importKey(name, key)
  }
  
  return (
    <Box direction="column">
      <form onSubmit={createIdentity}>
        <span>Create new identity:</span>
        <Box raised={false}>
          <span>Name (this is not shown online):</span>
          <input name="name" type="text"></input>
        </Box>
        <Box raised={false}>
          <span>Password:</span>
          <input name="password" type="password"></input>
        </Box>
        <button action="submit">Create!</button>
      </form>
    </Box>
  )
}

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
      <Box raised={false}>
        <Box direction="column" raised={false}>
          {identities.map(e => {
            const {name, id} = e
            //return <button key={e} onClick={() => login(e)}>{e}</button>
            return <IdentityCard key={id} name={name} id={id}/>
          })}
        </Box>
        <Box direction="column" raised={false}>
          <CreateIdentity />
          <ImportIdentity />
        </Box>
      </Box>
  )
}