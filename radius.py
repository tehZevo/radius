import os
import json
from dataclasses import dataclass
import tempfile
import base64

from dataclasses_json import dataclass_json

from ipfs_utils import read, write, publish, resolve, node_id, key_import, key_gen, key_rm, key_list, key_to_node_id
from keys import generate_key, encrypt_key, decrypt_key

#config
#TODO: make params/env vars
DHT_RECORD_COUNT = 5
#caching must be disabled for radius so when we resolve ipns,
#we get the latest version of their profile
NOCACHE = True
RESOLVE_AFTER_PUBLISH = False
LIFETIME = "5m"
RESOLVE_TIMEOUT = "5s"

@dataclass_json
@dataclass
class Profile:
    public_posts: list
    private_posts: list
    following: list
    
    def new():
        return Profile([], [], [])

def make_public_post(key_name, profile, message):
    profile = Profile(
        public_posts=[*profile.public_posts, message],
        private_posts=profile.private_posts,
        following=profile.following
    )
    save_profile(key_name, profile)
    
    return profile

def follow(key_name, profile, id):
    profile = Profile(
        public_posts=profile.public_posts,
        private_posts=profile.private_posts,
        following=[*profile.following, id]
    )
    save_profile(key_name, profile)
    
    return profile

def get_profile(id):
    try:
        cid = resolve(id, record_count=DHT_RECORD_COUNT, nocache=NOCACHE, timeout=RESOLVE_TIMEOUT)
        data = read(cid)
        profile = Profile.from_json(data)
        return profile
    #TODO: dont swallow all exceptions
    except:
        return None

def save_profile(key_name, profile):
    cid = write(profile.to_json())
    res = publish(key_name, cid, resolve=RESOLVE_AFTER_PUBLISH, lifetime=LIFETIME)
    # print(res)
    
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
