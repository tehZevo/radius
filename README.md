# Radius

## TODO
- Add timestamps to posts
- Generate key from mnemonic
  - Generate keys from Python
- Offline caching of posts/profiles
  - Especially if all of your nodes are offline for an extended time -- you will need to reupload all of your data
- Private posts (encrypted)
  - Explore splitting out post content and keys into separate CIDs
- Validation of profile/post data that result in warnings in the FE that allow the user to unfollow the "offender"
- Calculate "reach" based on number of people in your radius following you
- Explore if caching is needed
- Sort posts in feed reverse-chronologically
- How to handle likes/reactions? Are they stored in the reactor's profile?
- Show profile image, name, etc. on posts
- Show "1st" "2nd" or "3rd+" linkedin-style connection
- Replies
- Split following into its own page/tab on profile
- Make "known followers" page on profiles?
- Radius "slider"
- "Recommended" page or sidebar that shows profiles you are not following, sorted by some score (based on # of followers that you follow?)
- Import/Export tool in UI
- Explore how to not store all posts within profile
  - Split by day?
- Group chats
  - Just a different interface for private posts?
- Servers/channels? Or would this be an entirely different service that uses the same identity system as Radius?
- Explore other apps you could use with the same identity system (file storage/transfer interface?)