import {useState, useEffect} from "react"

export default function useFetcher(routine, placeholder)
{
  const [value, setValue] = useState(placeholder)
  
  async function doFetch(routine)
  {
    const value = await routine()
    console.log("fetched", value)
    setValue(value)
  }
  
  useEffect(() =>
  {
    console.log("using effect for", routine)
    doFetch(routine)
  }, [])
  
  return value
}

