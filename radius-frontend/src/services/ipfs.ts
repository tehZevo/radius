import axios from "axios";
import { v4 as uuid4 } from 'uuid';

//TODO: UI to set this
const IPFS_HOST = "http://127.0.0.1:5001"
const API_URL = `${IPFS_HOST}/api/v0`

export async function resolve(peerId, options={nocache: false, recordCount: 16, timeout: "5s"})
{
  const nocache = options.nocache ? 1 : 0
  const {timeout, recordCount} = options
  const res = await axios.post(`${API_URL}/name/resolve/${peerId}?nocache=${nocache}&dht-record-count=${recordCount}&dht-timeout=${timeout}`)
  //trim "/ipfs/"
  const cid = res.data.Path.replace("/ipfs/", "")
  return cid
}

//TODO: generate peer id from public key instead of importing to ipfs first
export async function getPeerIdFromKey(key)
{
  const name = uuid4()
  //TODO: catch failures
  const res = await importKey(name, key)
  await removeKey(name)
  return res.data.Id
}

export async function readBytes(cid)
{
  //TODO: idk why this works, but python reqests and docs say ?arg={cid}
  //TODO: catch bad statuses
  const res = await axios.post(`${API_URL}/cat/` + cid, null, {responseType: "arraybuffer"})
  return res.data
}

export async function readJson(cid)
{
  const bytes = await readBytes(cid)
  return JSON.parse(new TextDecoder().decode(bytes))
}

export async function removeKey(name)
{
  return await axios.post(`${API_URL}/key/rm/${name}`)
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
    `${API_URL}/key/import/${name}?format=pem-pkcs8-cleartext`,
    formData,
    {headers: {"Content-Type": "multipart/form-data"}}
  )
  
  return res
}

export async function publish(keyName, cid, options={})
{
  var {lifetime, resolve} = options
  resolve = resolve ? 1 : 0
  cid = encodeURIComponent("/ipfs/" + cid)
  //TODO: handle failure
  const res = await axios.post(
    `${API_URL}/name/publish?arg=${cid}&key=${keyName}&lifetime=${lifetime}&resolve=${resolve}`,
  )
  
  return res.data.Name
}

export async function writeBytes(bytes)
{
  const formData = new FormData()
  formData.append("file", new Blob([bytes]))

  //TODO: handle failure
  const res = await axios.post(
    `${API_URL}/add`,
    formData,
    {headers: {"Content-Type": "multipart/form-data"}}
  )
  
  return res.data.Hash
}

export async function writeJson(data)
{
  data = JSON.stringify(data)
  data = new TextEncoder().encode(data)
  return await writeBytes(data)
}