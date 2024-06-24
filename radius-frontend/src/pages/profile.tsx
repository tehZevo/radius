import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import * as radius from "../services/radius"
import Post from "../components/post/post"
import Box from "../components/box"
import FollowButton from "../components/profile/followButton"
import { PuffLoader } from "react-spinners"

export default function Profile() {
  const { userId } = useParams()
  const [profile, setProfile] = useState()
  const [posts, setPosts] = useState([])

  const distance = null //TODO: we don't know this.. need to return from BE

  async function fetchProfile() {
    const profile = await radius.getProfile(userId)
    setProfile(profile)
    setPosts(profile.public_posts.map((e) => null))
  }

  async function fetchPosts() {
    if (profile == null) {
      return
    }

    console.log("fetching posts...")
    await Promise.all(profile.public_posts.map(async (e, i) => {
      const post = await radius.readJson(e)

      setPosts((posts) => {
        posts = [...posts]
        posts[i] = post
        return posts
      })
    }))
    // const posts = []
    // for(var postId of profile.public_posts)
    // {
    //   console.log("fetching post", postId)
    //   const post = await radius.readJson(postId)
    //   posts.push(post)
    // }

    // setPosts(posts)
  }

  const spinner = <PuffLoader
    size="100px"
    color="#224488"
  />

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [profile])

  //TODO: need a second post type that resolves based on CID in FE?
  return (
    <Box direction="column" raised={false}>
      {profile ? (
        <>
          <Box raised={false}>
            <Box>{profile.name} ({userId})</Box>
            <Box>Distance: {distance ?? "unknown"}</Box>
            <FollowButton userId={userId} />
          </Box>
          <Box direction="column">
            <span>Following:</span>
            {profile.following.map(e => <Box key={e}>{e}</Box>)}
          </Box>
          <Box direction="column">
            <span>Posts:</span>
            <div>{posts.map(e => e ? <Post post={e} /> : spinner)}</div>
          </Box>
        </>
      ) : <span>Loading...</span>}
    </Box>
  )
}