import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import * as radius from "../services/radius"

export default function Post({profile, message})
{
  const navigate = useNavigate();

  return (
    <>
      <div>
        <p>Author</p>
        <p>TODO: need id</p>
        <p>content</p>
        <p>message</p>
      </div>
    </>
  )
}