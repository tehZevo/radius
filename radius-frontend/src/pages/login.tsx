import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import * as radius from "../services/radius"

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
    //TODO: send login request and navigate if successful
    await radius.login(identity, password)
    console.log("SUCCESS!")
    navigate("/profile")
  }
  
  return (
    <>
      <div>
        <form onSubmit={onSubmit}>
          Logging in to {identity}...
          <br />
          Password: <input name="password" type="password" required />
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  )
}