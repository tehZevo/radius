import EmojiPicker from 'emoji-picker-react';

import Box from "../box"
import DistanceIcon from "../profile/distanceIcon"
import Avatar from "../profile/avatar"
import PostAttachment from "./postAttachment"

export default function Post({post, author})
{
  const authorInfo = author ? (
    <Box raised={false}>
      <Avatar userId={author.id} />
      <a href={`/profile/${author.id}`}>{author.name}</a> ({author.id})
      <DistanceIcon distance={author.distance} />
    </Box>
  ) : null

  function handleReaction(emoji)
  {
    console.log(emoji)
  }
  
  return (
    <Box direction="column">
      {authorInfo}
      <span>{post.content} ({post.timestamp})</span>
      <Box raised={false}>
        {post.attachments.map((e) => <PostAttachment attachment={e} />)}
      </Box>
      <Box raised={false}>
        <EmojiPicker open={false} reactions={["1f44d", "1f44e"]} reactionsDefaultOpen={true} onReactionClick={handleReaction} onEmojiClick={handleReaction} lazyLoadEmojis={true} emojiStyle="twitter"/>
      </Box>
    </Box>
  )
}