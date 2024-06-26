import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import * as radius from "../services/radius"
import * as keys from "../services/keys"
import IdentityCard from "../components/identityCard"
import {fileToJson} from "../utils/fileUtils"
import Box from "../components/box"
import { loadKuboApiUrl } from '../services/radius/settings';
import FileDropzone from '../components/FileDropzone';

function ImportIdentity()
{
  const [identity, setIdentity] = useState()

  const onDrop = async files =>
  {
    var identity = files[0]
    identity = await fileToJson(identity)
    
    setIdentity(identity)
  }

  async function importIdentity()
  {
    const {name, id, key} = identity
    console.log("TODO: check these:", name, id, key)
    await radius.importAccount(name, id, key)
  }

  return (
    <Box direction="column">
      <FileDropzone
        onDrop={onDrop}
        dragText="Drop identity here..."
        defaultText="+ Import identity"
      />
      {identity ? <button onClick={importIdentity}>Import</button> : null}
    </Box>
  )
}

function CreateIdentity()
{
  const navigate = useNavigate();

  async function createIdentity(e)
  {
    e.preventDefault()
    const formData = new FormData(e.target)
    const name = formData.get("name")
    const password = formData.get("password")
    
    const {key, id} = await keys.generateIpfsKey(loadKuboApiUrl())
    const encryptedKey = await keys.encryptIpfsKey(key, password)
    await radius.importAccount(name, id, encryptedKey)

    //TODO: set some kind of global state instead of just navigating
    navigate(0)
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
  
  async function fetchIdentities()
  {
    const identities = Object.values(await radius.getIdentities())
    setIdentities(identities)
  }
  
  useEffect(() => {
    fetchIdentities()
  }, [])
  
  return (
      <Box raised={false}>
        <Box direction="column" raised={false}>
          {identities.map(({name, id}) => <IdentityCard key={id} name={name} id={id}/>)}
        </Box>
        <Box direction="column" raised={false}>
          <CreateIdentity />
          <ImportIdentity />
        </Box>
      </Box>
  )
}