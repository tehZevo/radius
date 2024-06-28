import { useNavigate } from 'react-router-dom';
import * as radius from "../services/radius"

export default function Settings()
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
    <>
      <div>
        <button onClick={logout}>Log out</button>
      </div>
      <form onSubmit={setName}>
        Name: <input name="name" type="text" required />
        <button type="submit">Update</button>
      </form>
      <form onSubmit={wipe}>
        Wipe account <input name="yes-im-really-sure" type="checkbox" required /> --yes-im-really-sure
        <button type="submit">Delete everything</button>
      </form>
    </>
  )
}

