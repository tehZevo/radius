import axios from "axios";
import { v4 as uuid4 } from 'uuid';

//NOTE: expects pkcs8 pem formatted key
const importKey = (apiUrl) => async (name, key) =>
{
  const formData = new FormData()
  formData.append("key", new Blob([key]), "key.pem")
  const res = await axios.post(
    `${apiUrl}/key/import/${name}?format=pem-pkcs8-cleartext`,
    formData,
    {headers: {"Content-Type": "multipart/form-data"}}
  )
  
  return res
}

const removeKey = (apuIrl) => async (name) =>
{
  return await axios.post(`${apuIrl}/key/rm/${name}`)
    .then(() => true)
    .catch((e) => 
    {
      if(e.response.data.Code == 0) return false

      throw e
    })
}

//TODO: generate peer id from public key instead of importing to ipfs first
const getPeerIdFromKey = (apiUrl) => async (key) =>
{
  const name = uuid4()
  //TODO: catch failures
  const res = await importKey(apiUrl)(name, key)
  await removeKey(apiUrl)(name)
  return res.data.Id
}

const readBytes = (apiUrl) => async (cid) =>
{
  //TODO: catch bad statuses
  const res = await axios.post(`${apiUrl}/cat/` + cid, null, {responseType: "arraybuffer"})
  return res.data
}

const readJson = (apiUrl) => async (cid) =>
{
  const bytes = await readBytes(apiUrl)(cid)
  return JSON.parse(new TextDecoder().decode(bytes))
}

const writeBytes = (apiUrl) => async (bytes) =>
{
  const formData = new FormData()
  formData.append("file", new Blob([bytes]))

  //TODO: handle failure
  const res = await axios.post(
    `${apiUrl}/add`,
    formData,
    {headers: {"Content-Type": "multipart/form-data"}}
  )
  
  return res.data.Hash
}

const writeJson = (apiUrl) => async (data) =>
{
  data = JSON.stringify(data)
  data = new TextEncoder().encode(data)
  return await writeBytes(apiUrl)(data)
}

const resolve = (apiUrl) => async (peerId, options={nocache: false, recordCount: 16, timeout: "5s"}) =>
{
  const nocache = options.nocache ? 1 : 0
  const {timeout, recordCount} = options
  const res = await axios.post(`${apiUrl}/name/resolve/${peerId}?nocache=${nocache}&dht-record-count=${recordCount}&dht-timeout=${timeout}`)
  //trim "/ipfs/"
  const cid = res.data.Path.replace("/ipfs/", "")
  return cid
}

const publish = (apiUrl) => async (keyName, cid, options={}) => 
{
  var {lifetime, resolve} = options
  resolve = resolve ? 1 : 0
  cid = encodeURIComponent("/ipfs/" + cid)
  //TODO: handle failure
  const res = await axios.post(
    `${apiUrl}/name/publish?arg=${cid}&key=${keyName}&lifetime=${lifetime}&resolve=${resolve}`,
  )
  
  return res.data.Name
}

const ipfs = (apiUrl) =>
({
  importKey: importKey(apiUrl),
  removeKey: removeKey(apiUrl),
  getPeerIdFromKey: getPeerIdFromKey(apiUrl),
  readBytes: readBytes(apiUrl),
  readJson: readJson(apiUrl),
  writeBytes: writeBytes(apiUrl),
  writeJson: writeJson(apiUrl),
  resolve: resolve(apiUrl),
  publish: publish(apiUrl),
})

export default ipfs