import os
import json
from dataclasses import dataclass
import tempfile
import base64

from dataclasses_json import dataclass_json

from ipfs_utils import read, write, publish, resolve, node_id, key_import, key_gen, key_rm, key_list, key_to_node_id
from keys import generate_key, load_key
from radius import Profile, make_public_post, get_following_radius

print("Loading key...")
key_name, key = load_key("./test-key.json", "test")

stored_keys = [k["Name"] for k in key_list()]
if key_name in stored_keys:
    print(f"Key '{key_name}' already in IPFS keys")
else:
    print("Importing key into IPFS...")
    key_import(key_name, key)

ipns_name = key_to_node_id(key_name)
print("you are", ipns_name)

profile = Profile.new()

profile = make_public_post(key_name, profile, "Hello World!")

radius = get_following_radius(ipns_name, 0)
print(radius)

radius = get_following_radius(ipns_name, 1)
print(radius)

radius = get_following_radius(ipns_name, 2)
print(radius)