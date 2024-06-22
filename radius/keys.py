import os
import tempfile
import subprocess
from uuid import uuid4
import json
import base64

from nacl import pwhash, secret, utils

from radius.ipfs_utils import key_list

HASHER = pwhash.argon2i
KDF = HASHER.kdf
OPS_LIMIT = HASHER.OPSLIMIT_SENSITIVE
MEM_LIMIT = HASHER.MEMLIMIT_SENSITIVE
KEY_SIZE = secret.SecretBox.KEY_SIZE

def generate_key():
    #TODO: requires ipfs cli until we can figure out the format to generate keys ourself
    
    name = str(uuid4())
    subprocess.run(["ipfs", "key", "gen", name])
    #jank
    keys = key_list()
    id = [k for k in keys if k["Name"] == name][0]["Id"]
    key_path = os.path.join(tempfile.gettempdir(), name)
    subprocess.run(["ipfs", "key", "export", name, "-o", key_path])
    
    with open(key_path, "rb") as f:
        key = f.read()
    
    os.unlink(key_path)
    
    #TODO: run in finally block
    subprocess.run(["ipfs", "key", "rm", name])
    
    return key, id

def load_key(path, password):
    with open(path, "r") as f:
        key_data = json.loads(f.read())
    
    key = key_data["key"]
    key = base64.b64decode(key)
    salt = key_data["salt"]
    salt = base64.b64decode(salt)
    name = key_data["name"]
    
    key = decrypt_key(key, salt, password)
    
    return name, key

def create_and_save_key(name, password, path):
    key, id = generate_key()
    key, salt = encrypt_key(key, password)
    
    key = base64.b64encode(key).decode("utf8")
    salt = base64.b64encode(salt).decode("utf8")
    
    with open(path, "w") as f:
        f.write(json.dumps({
            "key": key,
            "name": name,
            "salt": salt,
            "id": id
        }))

def encrypt_key(key, password):
    password = bytes(password, "utf8")
    salt = utils.random(HASHER.SALTBYTES)
    secret_key = KDF(KEY_SIZE, password, salt, opslimit=OPS_LIMIT, memlimit=MEM_LIMIT)
    box = secret.SecretBox(secret_key)
    nonce = utils.random(secret.SecretBox.NONCE_SIZE)
    encrypted = bytes(box.encrypt(key, nonce))
    
    return encrypted, salt
    
def decrypt_key(encrypted, salt, password):
    password = bytes(password, "utf8")
    secret_key = KDF(KEY_SIZE, password, salt, opslimit=OPS_LIMIT, memlimit=MEM_LIMIT)
    box = secret.SecretBox(secret_key)
    key = box.decrypt(encrypted)
    
    return key