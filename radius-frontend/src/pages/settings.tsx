import { useState, useEffect } from 'react'
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
  
  return (
    <>
      <div>
        <button onClick={logout}>Log out</button>
      </div>
      <form onSubmit={setName}>
        Name: <input name="name" type="text" required />
        <button type="submit">Update</button>
      </form>
    </>
  )
}

