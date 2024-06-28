import {getProfile} from "./profile"
import {getCurrentProfile, getCurrentAccount} from "./account"

//TODO: isFollowing, isInRadius, getDistance

///
//BFS search
//TODO: allow a cache to be passed in so they arent refetched?
export async function fetchProfilesInRadius(startId, radius)
{
  const explored = new Set()
  const profiles = {}
  const horizon = [[startId, 0]] //id, distance
  
  while(horizon.length > 0)
  {
    const [id, distance] = horizon.shift() //explore first
    //TODO: better handling of failed profile resolve
    const profile = await getProfile(id)
      .catch((e) => console.error("Failed to fetch profile " + id, e))
        
    profiles[id] = {
        "profile": profile,
        "distance": distance
    }
    explored.add(id)
    
    for(var nextId of profile.following)
    {
      //skip already explored and neighbors with too high of a distance
      if(explored.has(nextId) || distance + 1 > radius)
      {
        continue
      }
      
      horizon.push([nextId, distance + 1])
    }
  }
  return profiles
}

export async function getRecommended(userId, radius)
{
  const profiles = fetchProfilesInRadius(userId, radius)
  //filter out ourselves and people we already follow
  let recommended = Object.entries(profiles).filter(([id, p]) => p.distance > 1)
  recommended = recommended.map(([id, p]) => [id, p.profile, p.distance])
  //TODO: calculate score
  //TODO: sort (with score)
  recommended = recommended.map(([id, p, dist]) => [id, p, dist, 0])
  
  return recommended
}

export async function follow(id)
{
  const profile = getCurrentProfile()
  profile.following.push(profile)
  //coerce to listy set
  profile.following = Array.from(new Set(profile.following))
  
  await saveProfile(getCurrentAccount(), profile)
}

export const isFollowing = (follower, followee) => ppcl("isFollowing", { follower, followee })


export async function getPublicFeed(userId, radius)
{
  //TODO: filter self posts?
  const profiles = Object.values(await fetchProfilesInRadius(userId, radius))
  
  const posts: PostIdWithAuthor[] = []
  for(var profile of profiles)
    for(var postId of profile.profile.publicPosts)
    {
      posts.push({
        postId,
        author: {
          //TODO: verify id
          id: profile.profile.id,
          name: profile.profile.name,
          distance: profile.distance
        }
      })
    }
  return posts
}