import {useState, useEffect} from "react"
import * as radius from "../services/radius"

export default function useAccount()
{
  const [userId, setUserId] = useState()
  
  async function fetchAccount()
  {
    const userId = await radius.account()
    setUserId(userId)
  }
  
  useEffect(() =>
  {
    fetchAccount()
  }, [])
  
  return userId
}
