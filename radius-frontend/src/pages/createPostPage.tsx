import { useNavigate } from 'react-router-dom';
import CreatePost from '../components/post/createPost';
import * as radius from "../services/radius"

export default function CreatePostPage()
{
  const navigate = useNavigate()
  
  async function onPost(postId)
  {
    const userId = await radius.getUserId()
    navigate("/radius/profile" + userId)
  }
  
  return (
    <CreatePost onPost={onPost} />
  )
}