import { useNavigate } from 'react-router-dom';

export default function Post({authorId, authorProfile, post})
{
  const navigate = useNavigate();

  return (
    <>
      <div>
        <a href={`/profile/${authorId}`}>Author: {authorProfile.name} ({authorId})</a>
        <p>Timestamp: {post.timestamp}</p>
        <p>Message: {post.content}</p>
      </div>
    </>
  )
}