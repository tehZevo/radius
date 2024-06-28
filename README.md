# Radius

* All data is currently stored as dag-pb

## TODO
- Disable profile settings if not logged in
- Add "..." menu and remove/rename buttons to identities
- Reply post modal
- Animate modal (fade in bg, fade up post window)
- Replies
- Add profile pictures
- Add profile bios
- Mentions (@{ipns name})
- More spinners (when creating profile, when posting, etc)
- Reduce number of times we have to load data from local storage (Client objects stored in React state?)
- Readd tsc to build
- Create "groups" for private posts
- Audio / video capture for audio / video messages (just attachments)
- Expose all radius functionality through a single useRadius hook?
- Sort posts reverse-chronologically
- Potential for pinning your followee's posts
- Look into storing data as dag-json and dag-cbor
- Fix css interaction with emoji picker
- Can't react to posts if posts don't have ids. Most logical way to give posts ids is to make each one its own ipfs content
- Make emoji picker kind of a modal, so clicks outside or escape will close the picker
- Set ops on radii: for mutual reach, etc
- Videos in posts
- Deleting posts
- Notifications (follows, replies, reacts)
- Calculate "reach" based on number of people in your radius that can see your messages with a given radius
  - this is very expensive... figure out how to do it without fetting everyone elses' radius
- Unfollowing
- Store metadata (filename, size) with post data? (this would be fakeable), should verify
- Attachment thumbnails for pictures/videos (create on client side?)
- Add icons such as "X" in deleting a file and "+" for adding a file
- Images in post
- Add warning for large files
- What would a "discover" page look like? Would it even differ from feed?
  - Maybe start with profile cards like recommended, but with more info (like bio)
- Fix radius slider
- Progress indicators for file upload
- Use a scoring system for recommended (based on # of followers that you follow?)
- Browse while you wait for your post to send
- Verify ids on fetch, or just stop storing id inside profile altogether
- Show id when hovering over profile picture
- Generate key from mnemonic
  - Generate keys from Python (or js)
- Offline caching of posts/profiles
  - Explore if caching is needed
  - Cache last known CID of profiles you're interested in in case they dont log back in to publish via IPNS
  - Especially if all of your nodes are offline for an extended time -- you will need to reupload all of your data
- Private posts (encrypted)
  - Explore splitting out post content and keys into separate CIDs
- Validation of profile/post data that result in warnings in the FE that allow the user to unfollow the "offender"
- How to handle likes/reactions? Are they stored in the reactor's profile?
- Split following into its own page/tab on profile
- Make "known followers" page on profiles?
- Export identity
- Explore how to not store all posts within profile
  - Split by day?
- Group chats
  - Just a different interface for private posts?
- Servers/channels? Or would this be an entirely different service that uses the same identity system as Radius?
- Explore other apps you could use with the same identity system (file storage/transfer interface?)

### "TCP" over Radius
- Mailboxes, per-user, each has outgoing and acknowledgements
