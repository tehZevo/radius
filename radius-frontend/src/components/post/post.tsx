import { useState, useEffect } from "react"
import EmojiPicker from "emoji-picker-react"

import Box from "../box"
import DistanceIcon from "../profile/distanceIcon"
import Avatar from "../profile/avatar"
import PostAttachment from "./postAttachment"
import * as radius from "../../services/radius"
import { useRadius } from "../../hooks/radiusHooks"
import { PuffLoader } from "react-spinners"
import CreatePostModal from "./createPostModal"

function ReplyButton({postId})
{
  function openReply()
  {

  }

  return (
    // <button onClick={openReply}>Reply</button>
    <CreatePostModal />
  )
}

export default function Post({postId, author})
{
  const [post, setPost] = useState()
  const {useReplies} = useRadius()
  const replies = useReplies(postId)
  
  const authorInfo = author ? (
    <Box raised={false}>
      <Avatar userId={author.id} />
      <a href={`/profile/${author.id}`}>{author.name}</a> ({author.id})
      <DistanceIcon distance={author.distance} />
    </Box>
  ) : null

  useEffect(() => {
    radius.getPost(postId).then((post) => setPost(post))
  }, [postId])

  function handleReaction(emoji)
  {
    console.log(emoji)
  }

  const spinner = <PuffLoader
    size="100px"
    color="#224488"
  />
  
  return (
    <Box direction="column">
      {authorInfo}
      {post ? (
        <>
          <span>{post.content} ({post.timestamp})</span>
          <Box raised={false}>
            {post.attachments.map((e) => <PostAttachment attachment={e} />)}
          </Box>
          <Box raised={false}>
            <EmojiPicker open={false} reactions={["1f44d", "1f44e"]} reactionsDefaultOpen={true} onReactionClick={handleReaction} onEmojiClick={handleReaction} lazyLoadEmojis={true} emojiStyle="twitter"/>
          </Box>
          <ReplyButton postId={postId} />
          <Box direction="column" raised={false}>
            {/* TODO: test */}
            {replies.map((e) => e.postId)}
          </Box>
        </>
      ) : spinner}
    </Box>
  )
}