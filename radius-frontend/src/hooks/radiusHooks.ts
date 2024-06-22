import { useState, useEffect } from 'react';
import * as radius from "../radius";

//TODO: is this really needed?
function useUserId()
{
  const [userId, setUserId] = useState();
  
  async function fetchUserId()
  {
    const userId = radius.getClientId()
    setUserId(userId);
  }
  
  useEffect(() =>
  {
    fetchUserId();
  }, []);

  return userId;
}