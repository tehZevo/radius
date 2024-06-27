import axios from "axios";

//TODO: UI to set this
const IPFS_HOST = "http://127.0.0.1:5001"

export async function resolve(peerId, options={nocache: false, recordCount: 16, timeout: "5s"})
{
  const nocache = options.nocache ? 1 : 0
  const {timeout, recordCount} = options
  const res = await axios.post(`${IPFS_HOST}/api/v0/name/resolve/${peerId}?nocache=${nocache}&dht-record-count=${recordCount}&dht-timeout=${timeout}`)
  //trim "/ipfs/"
  const cid = res.data.Path.replace("/ipfs/", "")
  return cid
}

export async function publish(peerId, cid, options={})
{
  //TODO
}

export async function readBytes(cid)
{
  //TODO: idk why this works, but python reqests and docs say ?arg={cid}
  //TODO: catch bad statuses
  const res = await axios.post(`${IPFS_HOST}/api/v0/cat/` + cid, null, {responseType: "arraybuffer"})
  return res.data
}

export async function readJson(cid)
{
  const bytes = await readBytes(cid)
  return JSON.parse(new TextDecoder().decode(bytes))
}

export async function removeKey(name)
{
  return await axios.post(`${IPFS_HOST}/api/v0/key/rm/${name}`)
    .then(() => true)
    .catch((e) => 
    {
      if(e.response.data.Code == 0) return false

      throw e
    })
}

//NOTE: expects pkcs8 pem formatted key
export async function importKey(name, key)
{
  const formData = new FormData()
  formData.append("key", new Blob([key]), "key.pem")
  
  const res = await axios.post(
    `${IPFS_HOST}/api/v0/key/import/${name}?format=pem-pkcs8-cleartext`,
    formData,
    {headers: {"Content-Type": "multipart/form-data"}}
  )
  
  console.log(res)
  return res
}

export async function writeBytes(bytes)
{
  TODO
}

export async function writeJson(data)
{
  TODO
}