import os
import json
from dataclasses import dataclass
import tempfile
import base64
import time
from threading import Thread
import random
from operator import itemgetter
import traceback

from dataclasses_json import dataclass_json

from ipfs_utils import read, write, publish, node_id, key_import, key_gen, key_rm, key_list, key_to_node_id
from keys import generate_key, load_key
from radius import Profile, make_public_post, get_profile, get_profiles, follow, save_profile

FETCHER_THREADS = 3
#min seconds to wait between fetches per fetcher thread
FETCH_INTERVAL = 10

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
            self.profile = Profile.new()
            save_profile(self.key_name, self.profile)
            print("Profile created.")
        else:
            print("Profile fetched.")
        
        self.profiles = dict()
        self.upsert_profile(self.id, self.profile, 0)
        self.radius = 3 #TODO: make param
        
        self.threads = []
        
        self.start_threads()
    
    def wipe(self, yes_i_really_mean_it=False):
        if not yes_i_really_mean_it:
            raise ValueError("You didn't really mean it.")
            
        #TODO: set profile to empty profile
        #TODO: reset profiles
        self.profile = Profile.new()
        save_profile(self.key_name, self.profile)
        self.profiles = dict()
        self.upsert_profile(self.id, self.profile, 0)
    
    #TODO: what to do when the link between you and someone else breaks (unfollowed)?
    def upsert_profile(self, id, profile, distance):
        #upsert with minimum distance
        if id in self.profiles:
            existing_profile = self.profiles[id]
            self.profiles[id] = {
                "profile": profile,
                "distance": min(existing_profile["distance"], distance)
            }
            return
                
        self.profiles[id] = {
            "profile": profile,
            "distance": distance
        }
    
    def profiles_within_radius(self, radius):
        return {id: profile for id, profile in self.profiles.items() if profile["distance"] <= radius}
    
    def fetcher_thread(self):
        while True:
            time_remaining = FETCH_INTERVAL
            try:
                start_time = time.time()
                #TODO: better would be to grab all profile ids and their followers within a given radius
                profiles = self.profiles_within_radius(self.radius - 1)
                #TODO: naive: this oversamples people who are followed more
                #pick random id from known profiles:
                profile = random.choice(list(profiles.values()))
                profile, distance = itemgetter("profile", "distance")(profile)
                
                if len(profile.following) == 0:
                    pass
                else:
                    next_id = random.choice(profile.following)
                    next_profile = get_profile(next_id)
                    self.upsert_profile(next_id, next_profile, distance + 1)
                
                end_time = time.time()
                time_taken = end_time - start_time
                time_remaining = max(0, FETCH_INTERVAL - time_taken)
            except Exception as e:
                print("Exception in fetcher thread:")
                traceback.format_exc()
            time.sleep(time_remaining)
    
    def start_threads(self):
        self.threads = []
        for _ in range(FETCHER_THREADS):
            t = Thread(target=self.fetcher_thread, daemon=True)
            t.start()
            self.threads.append(t)
    
    def stop_threads(self):
        for t in self.threads:
            t.stop()
        self.threads = []
    
    def make_public_post(self, content):
        #TODO: is this thread safe?
        self.profile = make_public_post(self.key_name, self.profile, content)
    
    def follow(self, id):
        #TODO: ensure following is a SET not a list
        #TODO: also need to make a radius constraint here to warn users about malformed following
        self.profile = follow(self.key_name, self.profile, id)
        print("new profile after follow", self.profile)
    
    def get_public_feed(self):
        #TODO: filter self posts?
        profiles = self.profiles_within_radius(self.radius)
        profiles = [profile["profile"] for profile in profiles.values()]
        posts = [profile.public_posts for profile in profiles]
        posts = [
            post
            for sublist in posts
            for post in sublist
        ]
        return posts
        
