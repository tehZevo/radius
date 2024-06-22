import json

from ipfs import read, write, publish, resolve, node_id

#TODO: pin

#TODO: sync directory to/from ipfs instead of single file

#TODO:
#store ipns private key on ipfs, encrypted (+key stretching), and published by the same ipns key
#devices can easily share that ipns key by scanning qr code/whatever
#unlock your ipns key with your passphrase
#store message cids in structure stored at ipns

def get_latest_message_cid(ipns_name):
    #TODO: dont swallow all exception types
    try:
        return resolve(ipns_name)
    except:
        pass

def get_latest_message(ipns_name):
    cid = get_latest_message_cid(ipns_name)
    message = read(cid)
    message = json.loads(message)
    return message
    
#TODO: make iterator?
def get_previous_message(message):
    prev_cid = message["prev_cid"]
    if prev_cid is not None:
        prev = read(prev_cid)
        prev = json.loads(prev)
        return prev

def post_message(content):
    my_id = node_id()
    latest_cid = get_latest_message_cid(my_id)
    message = {
        "prev_cid": latest_cid,
        "content": content
    }
    new_cid = write(json.dumps(message))
    publish(new_cid)

for i in range(3):
    post_message(f"hello {i}")

message = get_latest_message(node_id())
print(message["content"])

while message["prev_cid"] is not None:
    message = get_previous_message(message)
    print(message["content"])