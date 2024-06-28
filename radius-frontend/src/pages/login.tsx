import { useNavigate, useLocation } from 'react-router-dom';
import * as radius from "../services/radius"
import Box from '../components/box';

export default function Login()
{
  const {state} = useLocation();
  const {identity} = state
  const navigate = useNavigate();
  
  async function onSubmit(e)
  {
    e.preventDefault()
    const formData = new FormData(e.target)
    const password = formData.get("password")
    await radius.login(identity, password)
    navigate("/feed")
  }
  
  return (
    <Box>
      <form onSubmit={onSubmit}>
        Logging in to {identity}...
        <br />
        Password: <input name="password" type="password" required />
        <button type="submit">Login</button>
      </form>
    </Box>
  )
}