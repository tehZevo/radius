import {useState, useEffect} from "react"

//TODO: idk how i feel about this
export default function useGetterSetter(getter, setter, placeholder:any=null)
{
  const [value, setValue] = useState(placeholder)
  
  useEffect(() =>
  {
    const value = getter()
    setValue(value)
  }, [])

  function delegateSetter(value)
  {
    setter(value)
    value = getter()
    setValue(value)
  }
  
  return [value, delegateSetter]
}
