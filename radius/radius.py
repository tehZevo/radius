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
        return Profile(id, name, [], [], [])

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
        
    #upload post to ipfs
    post = Post.new(content, attachments=uploaded_attachments)
    post_cid = write("post", post.to_json())

    #save post cid in profile
    profile = dataclasses.replace(profile, public_posts=[*profile.public_posts, post_cid])
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

def save_profile(key_name, profile):
    cid = write("profile", profile.to_json())
    res = publish(key_name, cid, resolve=RESOLVE_AFTER_PUBLISH, lifetime=LIFETIME)