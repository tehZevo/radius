import time

from client import Client


alice_key_name = Client.load_key("./keys/alice.json", "alice")
bob_key_name = Client.load_key("./keys/bob.json", "bob")
charlie_key_name = Client.load_key("./keys/charlie.json", "charlie")

#TODO: why were there commas in generated key names
alice = Client(alice_key_name)
bob = Client(bob_key_name)
# charlie = Client(charlie_key_name)

print("alice", alice.id)
print("bob", bob.id)

alice.follow(bob.id)
bob.make_public_post("hello alice")
alice.make_public_post("hello bob")

while True:
    posts = alice.get_public_feed()
    print(len(posts))
    time.sleep(1)