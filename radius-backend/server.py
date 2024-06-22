import os
import time
import argparse
from operator import itemgetter
from pathlib import Path

from protopost import ProtoPost

from radius.client import Client
from radius.keys import create_and_save_key

#TODO: env vars
KEY_STORE_DIR = "./keys"
PORT = 8123

client = None

#TODO: get logged in identities

def identity_path(key_name):
    return os.path.join(KEY_STORE_DIR, f"{key_name}.json")

def get_identities(_):
    return [Path(f).stem for f in os.listdir(KEY_STORE_DIR)]

def has_identity(name):
    #TODO: if key with name is in key store dir, return true
    pass

def import_identity(data):
    #TODO
    pass

def export_identity(data):
    #TODO
    pass

def create_identity(data):
    #TODO: restrict key_name to [A-Za-z0-9-_]
    #TODO: password strength warning on the FE
    key_name, password = itemgetter("key_name", "password")(data)
    
    print("Creating identity", key_name, "...")
    
    create_and_save_key(
        key_name,
        password,
        identity_path(key_name)
    )

def login(data):
    global client
    
    identity_name, password = itemgetter("name", "password")(data)
    
    #TODO: allow multiple identities to be logged in at once
    if client is not None:
        print("Client is already logged in, ignoring.")
        return
        
    print(f"Importing key from {identity_path(identity_name)}...")
    
    key_name = Client.load_key(identity_path(identity_name), password, clear_first=True)
    
    client = Client(key_name)
    print("Logged in!")
    
    return client.id

def logout(_):
    global client
    client = None

def follow(id):
    #TODO: validate
    print("Following", id, "...")
    client.follow(id)
    print("Done.")
    
def get_profiles(_):
    print(client.profiles)
    
def wipe(_):
    print("Wiping profile...")
    client.wipe(yes_i_really_mean_it=True)
    print("Done.")
    
def get_following(_):
    return client.profile.following

def set_radius(radius):
    #TODO: test weird values like -1
    client.radius = radius
    print("Radius updated to", client.radius)

def get_feed(_):
    return client.get_public_feed()

def post(message):
    print("Posting message...")
    client.make_public_post(message)
    print("Done.")

#TODO: support get following of other known profiles (or else fetch profile first?)
def get_following(_):
    return client.profile.following

#TODO: support getting posts of any known profile (or else fetch first)
def get_public_posts(_):
    return client.profile.public_posts

def get_profile(id):
    if id not in client.profiles:
        client.fetch_profile(id)
        
    #TODO: return distance as well?
    return client.profiles[id]["profile"].to_dict()

def set_radius(radius):
    client.radius = radius

ProtoPost({
    "getClientId": lambda _: client.id,
    "getFollowing": get_following,
    "getRadius": lambda _: client.radius,
    "follow": follow,
    "setRadius": set_radius,
    "getFeed": get_feed,
    "wipe": wipe,
    "getProfile": get_profile,
    "getProfiles": get_profiles,
    "post": post,
    "login": login,
    "logout": logout,
    "getIdentities": get_identities,
    "createIdentity": create_identity,
    "setName": lambda name: client.change_name(name),
}).start(PORT)
