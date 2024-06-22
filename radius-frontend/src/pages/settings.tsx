import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import * as radius from "../services/radius"

export default function Settings()
{
  const navigate = useNavigate();
  
  async function logout(e)
  {
    await radius.logout()
    navigate("/")
  }
  
  return (
    <>
      <div>
        <button onClick={logout}>Log out</button>
      </div>
    </>
  )
}