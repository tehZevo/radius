from dataclasses import dataclass
from collections import deque
import time
import dataclasses

from dataclasses_json import dataclass_json

from radius.ipfs_utils import read, write, publish, resolve

#config
#TODO: make params/env vars
DHT_RECORD_COUNT = 5
#caching must be disabled for radius so when we resolve ipns,
#we get the latest version of their profile
NOCACHE = True
RESOLVE_AFTER_PUBLISH = False
LIFETIME = "24h"
RESOLVE_TIMEOUT = "5s"

@dataclass_json
@dataclass
class Profile:
    id: str #TODO: verify this or inject it since we SHOULD already know it
    name: str
    public_posts: list
    private_posts: list
    following: list
    
    def new(id, name=None):
        name = "Anonymous" if name is None else name
        return Profile(id, name,[], [], [])

@dataclass_json
@dataclass
class Attachment:
    name: str
    cid: str
    # size: int #TODO, also #TODO: validate
    #TODO: thumbnails/previews?
    
@dataclass_json
@dataclass
class Post:
    content: str
    attachments: list
    timestamp: int
    
    def new(content, attachments=[], timestamp=None):
        timestamp = int(time.time()) if timestamp is None else timestamp
        return Post(content, attachments, timestamp)

@dataclass_json
@dataclass
class Author:
    id: str
    name: str
    distance: int

@dataclass_json
@dataclass
class PostWithAuthor:
    post: Post
    author: Author
    
    def new(post, author_profile_with_distance):
        author = author=Author(
            id=author_profile_with_distance["profile"].id,
            name=author_profile_with_distance["profile"].name,
            distance=author_profile_with_distance["distance"]
        )
        return PostWithAuthor(post, author)

def make_public_post(key_name, profile, content, attachments=[]):
    #if attachments, upload all to ipfs first
    #TODO: catch failures
    if len(attachments) > 0:
        print("Uploading", len(attachments), "attachments...")
    uploaded_attachments = []
    for name, data in attachments:
        print("Uploading", name, "...")
        cid = write(name, data)
        uploaded_attachments.append(Attachment(name, cid))
        
    post = Post.new(content, attachments=uploaded_attachments)
    profile = dataclasses.replace(profile, public_posts=[*profile.public_posts, post])
    save_profile(key_name, profile)
    
    return profile

def follow(key_name, profile, id):
    profile = dataclasses.replace(profile, following=[*profile.following, id])
    save_profile(key_name, profile)
    
    return profile

def get_profile(id):
    try:
        cid = resolve(id, record_count=DHT_RECORD_COUNT, nocache=NOCACHE, timeout=RESOLVE_TIMEOUT)
        data = str(read(cid), "utf8")
        profile = Profile.from_json(data)
        return profile
    #TODO: dont swallow all exceptions
    except:
        return None

#BFS search
#TODO: allow a cache to be passed in so they arent refetched?
def fetch_profiles_in_radius(start_id, radius, verbose=False):
    explored = set()
    profiles = dict()
    horizon = deque([(start_id, 0)]) #id, distance
    
    while len(horizon) > 0:
        id, distance = horizon.popleft()
        t = time.time()
        profile = get_profile(id)
        #failed to resolve, skip
        if profile is None:
            continue
            
        if verbose:
            print(id, distance, "fetch took", time.time() - t)
        profiles[id] = {
            "profile": profile,
            "distance": distance
        }
        explored.add(id)
        
        for next_id in profile.following:
            #skip already explored and neighbors with too high of a distance
            if next_id in explored:
                continue
            if distance + 1 > radius:
                continue
            horizon.append((next_id, distance + 1))
            
    return profiles

def save_profile(key_name, profile):
    cid = write("profile", profile.to_json())
    res = publish(key_name, cid, resolve=RESOLVE_AFTER_PUBLISH, lifetime=LIFETIME)
    
def get_profiles(id, radius, explored=None):
    if radius <= 0:
        return dict()
    
    #TODO: handle cases where its not a valid radius profile
    profile = get_profile(id)
    profiles = {id: profile}
    #TODO: i think explored is just equal to following
    explored = set([id]) if explored is None else explored
    
    for next_id in profile.following:
        print("exploring", next_id)
        next_profiles = get_profiles(next_id, radius - 1, explored=explored.copy())
        explored.add(next_id)
        profiles.update(next_profiles)
    
    return profiles
