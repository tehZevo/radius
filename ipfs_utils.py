import requests
import subprocess

#TODO: make client class
IPFS_HOST = "127.0.0.1:5001"
IPFS_API_URL = f"http://{IPFS_HOST}/api/v0"

def key_to_node_id(key_name):
    return [k for k in key_list() if k["Name"] == key_name][0]["Id"]
    
def key_list():
    r = requests.post(f"{IPFS_API_URL}/key/list")
    if r.status_code != 200:
        raise Exception(r.text)
    
    return r.json()["Keys"]

#TODO: other params?
def key_gen(name):
    r = requests.post(f"{IPFS_API_URL}/key/gen?arg={name}")
    if r.status_code != 200:
        raise Exception(r.text)
    
    return r.json()

def key_import(name, key):
    r = requests.post(f"{IPFS_API_URL}/key/import?arg={name}", files={"file": key})
    if r.status_code != 200:
        raise Exception(r.text)

    return r.json()

def key_rm(name):
    r = requests.post(f"{IPFS_API_URL}/key/rm?arg={name}")
    if r.status_code != 200:
        raise Exception(r.text)
    
    return r.json()

def node_id():
    r = requests.post(f"{IPFS_API_URL}/id")
    if r.status_code != 200:
        raise Exception(r.text)
    
    return r.json()["ID"]

def write(data):
    r = requests.post(f"{IPFS_API_URL}/add", files={"file":data})
    if r.status_code != 200:
        raise Exception(r.text)
    
    return r.json()["Hash"]

def read(path):
    r = requests.post(f"{IPFS_API_URL}/cat?arg=" + path)
    if r.status_code != 200:
        raise Exception(r.text)
    
    return r.text #TODO: dont assume text

#TODO: allow other keys than default to be used
#TODO: allow custom lifetime
def publish(key_name, path, lifetime="5m", resolve=False):
    # print(resolve)
    resolve = "true" if resolve else "false"
    #TODO: implement timeout in api version
    # r = requests.post(f"{IPFS_API_URL}/name/publish?arg={path}&key={key_name}&lifetime={lifetime}&reasolve={resolve}")
    # if r.status_code != 200:
    #     raise Exception(r.text)
    # 
    # r = r.json()
    # return r["Name"]
    # print(" ".join(["ipfs", "name", "publish", f"--resolve={resolve}", f"--key={key_name}", path]))
    subprocess.run(["ipfs", "name", "publish", f"--resolve={resolve}", f"--key={key_name}", path])
    
def resolve(name, nocache=False, record_count=16, timeout="30s"):
    nocache = "true" if nocache else False
    r = requests.post(f"{IPFS_API_URL}/name/resolve?arg={name}&dht-timeout={timeout}&nocache={nocache}&dht-record-count={record_count}")
    if r.status_code != 200:
        raise Exception(r.text)
        
    return r.json()["Path"]
