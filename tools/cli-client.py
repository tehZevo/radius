import os
import time
import argparse
from getpass import getpass

from client import Client
from keys import create_and_save_key

parser = argparse.ArgumentParser()
parser.add_argument("-i", "--identity-file", required=True)
args = parser.parse_args()

if not os.path.exists(args.identity_file):
    #TODO: create directory if not exist
    
    create_new_identity = input(f"Identity file '{args.identity_file}' not found, create new identity? ([y]/n): ")
    #TODO: better ux here
    create_new_identity = not create_new_identity.lower().strip().startswith("n")
    if not create_new_identity:
        exit()
    
    dirname = os.path.dirname(args.identity_file)
    name = input("Identity name (used for IPFS keystore, not shown to other users): ")
    password = getpass(prompt="Identity password: ")
    
    os.makedirs(dirname, exist_ok=True)
    create_and_save_key(
        name,
        password,
        args.identity_file
    )

print(f"Importing key from {args.identity_file}...")
password = getpass()
key_name = Client.load_key(args.identity_file, password, clear_first=True)

#TODO: why were there commas in generated key names
client = Client(key_name)

print("Welcome! Here is some information that may prove useful:")
print("- Your user id (IPNS name):", client.id)
print("- You are following", len(client.profile.following), "users")
print("- You have", len(client.profile.public_posts), "public posts")
print("- Your currently set radius:", client.radius)

#TODO: list following of any id!
#TODO: list posts of any id!

print("Available commands:")
print("/follow [id]: Follow a user with the given id")
print("/following: List who you are following")
print("/radius [n]: change your radius (defaults to 3)")
print("/feed: list all posts within your set radius")
print("/post [message]: posts a message to your profile")
print("/wipe: delete your profile")
print("/profiles: dump raw data of known profiles")

def cmd_follow(id):
    #TODO: validate
    print("Following", id, "...")
    client.follow(id)
    print("Done.")
    
def cmd_profiles(_):
    print(client.profiles)
    
def cmd_wipe(_):
    wipe = input("Are you sure? (y/[n]): ")
    if wipe != "y":
        print("Canceling.")
        return
    wipe = input("Are you REALLY sure? (y/[n]): ")
    if wipe != "y":
        print("Canceling.")
        return
    
    wipe = input("This is your last chance. This will clear all profile data stored in your IPNS record. Are you ABSOLUTELY sure? (y/[n]): ")
    if wipe != "y":
        print("Canceling.")
        return
    
    #TODO: need method to point to empty cid with ipns
    print("Wiping profile...")
    client.wipe(yes_i_really_mean_it=True)
    print("Done.")
    
def cmd_following(_):
    print(client.profile.following)

def cmd_radius(radius):
    radius = int(radius)
    #TODO: test weird values like -1
    client.radius = radius
    print("Radius updated to", client.radius)

def cmd_feed(_):
    print(client.get_public_feed())

def cmd_post(message):
    print("Posting message...")
    client.make_public_post(message)
    print("Done.")

commands = {
    "/follow": cmd_follow,
    "/radius": cmd_radius,
    "/feed": cmd_feed,
    "/post": cmd_post,
    "/following": cmd_following,
    "/wipe": cmd_wipe,
    "/profiles": cmd_profiles,
}

while True:
    command = input("> ")
    if command.strip() == "":
        continue
        
    for name, fun in commands.items():
        if command.split()[0].lower() == name:
            fun(command[len(name):].strip())
