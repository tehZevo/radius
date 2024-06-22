import os
import json
from dataclasses import dataclass
import dataclasses
import tempfile
import base64
import random
from operator import itemgetter
import traceback

from dataclasses_json import dataclass_json

from ipfs_utils import read, write, publish, node_id, key_import, key_gen, key_rm, key_list, key_to_node_id
from keys import generate_key, load_key
from radius import Profile, make_public_post, get_profile, get_profiles, follow, save_profile, fetch_profiles_in_radius

def min_profile_distance(a, b):
    if a is None and b is None:
        return None
    if a is None:
        return b
    if b is None:
        return a
    
    return min(a, b)

def upsert_profile_based_on_distance(profiles, id, profile, distance):
    if profile is None:
        raise ValueError(f"Profile with id {id} was None. Not upserting.")
    
    profiles = profiles.copy()
    
    #upsert with minimum distance
    if id in profiles:
        existing_profile = profiles[id]
        profiles[id] = {
            "profile": profile,
            "distance": min_profile_distance(existing_profile["distance"], distance)
        }
        return profiles
    
    profiles[id] = {
        "profile": profile,
        "distance": distance
    }
    
    return profiles

class Client:
    def load_key(path, password, clear_first=False):
        key_name, key = load_key(path, password)
        
        if clear_first:
            try:
                key_rm(key_name)
            #TODO: dont swallow all
            except:
                pass
        
        stored_keys = [k["Name"] for k in key_list()]
        if key_name in stored_keys:
            raise ValueError(f"Key '{key_name}' already in IPFS keys")
            
        print("Importing key into IPFS...")
        key_import(key_name, key)
        
        return key_name
    
    def __init__(self, key_name):
        self.key_name = key_name
        #get node id from key name
        self.id = key_to_node_id(self.key_name)
        #fetch own profile
        print("Fetching profile...")
        #TODO: what to do if not exist?
        self.profile = get_profile(self.id)
        if self.profile is None:
            print("Profile not found, creating...")
            self.profile = Profile.new(self.id)
            save_profile(self.key_name, self.profile)
            print("Profile created.")
        else:
            print("Profile fetched.")
        
        self.profiles = dict()
        self.profiles = upsert_profile_based_on_distance(self.profiles, self.id, self.profile, 0)
        self.radius = 3 #TODO: make param
        
    def wipe(self, yes_i_really_mean_it=False):
        if not yes_i_really_mean_it:
            raise ValueError("You didn't really mean it.")
            
        #TODO: set profile to empty profile
        #TODO: reset profiles
        self.profile = Profile.new()
        save_profile(self.key_name, self.profile)
        self.profiles = dict()
        self.profiles = upsert_profile_based_on_distance(self.profiles, self.id, self.profile, 0)
    
    #TODO: what to do when the link between you and someone else breaks (unfollowed)?
    def upsert_profile(self, id, profile, distance):
        if profile is None:
            raise ValueError(f"Profile with id {id} was None. Not upserting.")
            
        #upsert with minimum distance
        if id in self.profiles:
            existing_profile = self.profiles[id]
            self.profiles[id] = {
                "profile": profile,
                "distance": self.min_distance(existing_profile["distance"], distance)
            }
            return
        
        print("upserting", id)
        self.profiles[id] = {
            "profile": profile,
            "distance": distance
        }
    
    def fetch_profile(self, id):
        profile = get_profile(id)
        print(profile)
        self.profiles = upsert_profile_based_on_distance(self.profiles, id, profile, None)
    
    def make_public_post(self, content):
        #TODO: is this thread safe?
        self.profile = make_public_post(self.key_name, self.profile, content)
    
    def follow(self, id):
        #TODO: ensure following is a SET not a list
        #TODO: also need to make a radius constraint here to warn users about malformed following
        self.profile = follow(self.key_name, self.profile, id)
        print("new profile after follow", self.profile)
    
    def change_name(self, name):
        self.profile = dataclasses.replace(self.profile, name=name)
        save_profile(self.key_name, self.profile)
    
    def get_public_feed(self):
        #TODO: filter self posts?
        profiles = fetch_profiles_in_radius(self.id, self.radius)
        profiles = [profile["profile"] for profile in profiles.values()]
        posts = [profile.public_posts for profile in profiles]
        posts = [
            post
            for sublist in posts
            for post in sublist
        ]
        return posts
        
