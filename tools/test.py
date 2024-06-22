import os
import json
from dataclasses import dataclass
import tempfile
import base64

from dataclasses_json import dataclass_json

from radius.ipfs_utils import read, write, publish, node_id, key_import, key_gen, key_rm, key_list, key_to_node_id
from radius.keys import generate_key
from radius.radius import Profile, make_public_post, get_profiles, follow, save_profile

def gen_person(name):
    try:
        key_rm(name)
    except:
        pass
    
    key, id = generate_key()
    key_import(name, key)
    profile = Profile.new()
    # id = key_to_node_id(name)
    
    save_profile(name, profile)
    
    return profile, id

#generate some keys
alice, alice_id = gen_person("alice")
bob, bob_id = gen_person("bob")
# charlie, charlie_id = gen_person("charlie")
# dave, dave_id = gen_person("dave")

print("alice following bob")
follow("alice", alice, bob_id)
# 
# print("bob following charlie")
# follow("bob", bob, charlie_id)
# 
# print("charlie following dave")
# follow("charlie", charlie, dave_id)

# profile = make_public_post(key_name, profile, "Hello World!")

# radius = get_profiles(alice_id, 0)
# print(radius)
# 
# radius = get_profiles(alice_id, 1)
# print(radius)
# 
# radius = get_profiles(alice_id, 2)
# print(radius)
# 
# radius = get_profiles(alice_id, 3)
# print(radius)

#TODO: would be better to round robin request profiles


make_public_post("bob", bob, "hello alice")

profiles = get_profiles(alice_id, 2)
posts = [profile.public_posts for profile in profiles.values()]
posts = [
    post
    for sublist in posts
    for post in sublist
]

print(posts)


key_rm("alice")
key_rm("bob")
# key_rm("charlie")
# key_rm("dave")