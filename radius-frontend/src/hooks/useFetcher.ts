import {useState, useEffect} from "react"

export default function useFetcher(routine, placeholder)
{
  const [value, setValue] = useState(placeholder)
  
  async function doFetch(routine)
  {
    const value = await routine()
    setValue(value)
  }
  
  useEffect(() =>
  {
    doFetch(routine)
  }, [])
  
  return value
}

