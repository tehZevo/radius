"radius"
your feed filled with posts from a selectable radius of followers

"repost" to allow new people to read it

could split out post content and keys into separate cids

- how to avoid pulling all user posts?
- how to sort reverse chronologically?
  - store posts by day in profile?
  
private posts?

group chats? (just a different interface for private posts?)


what about "servers" and channels? etc
- people post to a channel
- this sounds like a different service than radius

other apps you could make with radius identity system:
- encrypted file transfer

#TODO: mnemonics

#TODO: generate keys from python

- offline caching of posts/profiles

- calculate reach based on number of people in your radius following you

- how to handle likes/reactions? are they stored in the reactor's profile?

- replies

- login ui that shows list of known keys with import and generation tools

# UI:

## Feed page
- shows a feed of all posts within your radius

## Feed post
- shows profile image, name, post content, and reactions
- ... menu with "(un) follow user"
- "1st" "2nd" or "3rd+" linkedin-style connection

## Profile
- shows profile image, name, and all posts
- refresh profile button, which manually reloads their profile
- (or should this be done automatically whenever we visit the page?)

## Following
- shows list of people you're following

## Recommended
- shows profiles you are not following, sorted by some score (based on # of followers that you follow)

## Post dialog