import * as radius from "../../services/radius"

export default function FollowButton({userId})
{
  async function follow()
  {
    await radius.follow(userId)
  }
  
  return (
    <button onClick={follow}>Follow</button>
  )
}