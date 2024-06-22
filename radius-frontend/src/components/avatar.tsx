import Jdenticon from "react-jdenticon"

export default function Avatar({profile, userId})
{
  //TODO: if profile has pfp, then usethat instead of identicon
  return <a href={`/profile/${userId}`}><Jdenticon size="48" value={userId} /></a>
}
