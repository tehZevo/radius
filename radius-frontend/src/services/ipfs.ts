// import { createHelia } from 'helia'
import { unixfs } from '@helia/unixfs'
import { createHeliaHTTP } from '@helia/http'
import { ipns } from '@helia/ipns'
import { CID } from 'multiformats/cid'
import { concat } from "uint8arrays/concat"

var helia = null
var heliaIpfs = null
var heliaIpns = null

export async function getHelia()
{
  if(helia == null)
  {
    //TODO: bad chrome behavior, monitor:
    //https://github.com/ipfs/helia/issues/164 and
    //https://github.com/libp2p/js-libp2p/issues/1896
    // helia = await createHelia()
    
    helia = await createHeliaHTTP()
  }

  return helia;
}

export async function getIpfs()
{
  if(heliaIpfs == null)
  {
    heliaIpfs = unixfs(await getHelia())
  }

  return heliaIpfs
}

export async function getIpns()
{
  if(heliaIpns == null)
  {
    heliaIpns = ipns(await getHelia())
  }

  return heliaIpns
}

export async function resolve(peerId, options={})
{
  return (await getIpns()).resolve(peerId, options)
}

export async function publish(peerId, cid, options={})
{
  cid = CID.parse(cid)
  return (await getIpns()).publish(peerId, cid, options)
}

export async function readBytes(cid)
{
  const fs = await getIpfs()
  cid = CID.parse(cid)

  const arrays = []
  for await (const buf of fs.cat(cid))
  {
    arrays.push(buf)
  }

  return concat(arrays)
}

export async function readJson(cid)
{
  return JSON.parse(new TextDecoder().decode(await readBytes(cid)))
}

export async function writeBytes(bytes)
{
    TODO
}

export async function writeJson(data)
{
    TODO
}