import { useNavigate } from 'react-router-dom';
import * as radius from "../services/radius"
import { useRadius } from '../hooks/radiusHooks';
import Box from "../components/box"

function ProfileSettings()
{
  const navigate = useNavigate();
  
  async function logout()
  {
    await radius.logout()
    navigate("/")
  }
  
  async function setName(e)
  {
    e.preventDefault()
    const formData = new FormData(e.target)
    const name = formData.get("name")
    await radius.setName(name)
  }
  
  async function wipe(e)
  {
    e.preventDefault()
    const formData = new FormData(e.target)
    const sure = formData.get("yes-im-really-sure")
    if(!sure)
    {
      return
    }
    
    await radius.wipeAccount(sure)
    navigate("/")
  }
  
  return (
    <Box direction="column">
      Profile settings
      <div><button onClick={logout}>Log out</button></div>
      <form onSubmit={setName}>
        Name: <input name="name" type="text" required />
        <button type="submit">Update</button>
      </form>
      <form onSubmit={wipe}>
        Wipe account: <input name="yes-im-really-sure" type="checkbox" required /> --yes-im-really-sure
        <button type="submit">Delete everything</button>
      </form>
    </Box>
  )
}

function SystemSettings()
{
  const {useKuboApiUrl} = useRadius()
  const [apiUrl, setApiUrl] = useKuboApiUrl()
  
  async function updateApiUrl(e)
  {
    e.preventDefault()
    const formData = new FormData(e.target)
    const url = formData.get("api-url")
    setApiUrl(url)
  }

  return (
    <Box direction="column">
      System settings
      <form onSubmit={updateApiUrl}>
        Kubo API url: <input name="api-url" type="text" defaultValue={apiUrl} required />
        <button type="submit">Update</button>
      </form>
    </Box>
  )
}

export default function Settings()
{
  return (
    <Box raised={false}>
      <ProfileSettings />
      <SystemSettings />
    </Box>
  )
}

