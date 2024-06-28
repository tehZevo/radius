import nacl from "tweetnacl"
import {pbkdf2Async} from "@noble/hashes/pbkdf2"
import { sha256 } from '@noble/hashes/sha256';
import {encode, decode} from "base64-arraybuffer"
import makeIpfs from "./ipfs"

export function why(key)
{
    const a = new Uint8Array([
        0x30, 78, //sequence of 78 bytes
        2, 1, //version
        0, //0 = private key only
        48, 5, //5 byte oid sequence follows
        6, 3, 43, 101, 112, //ed25519 oid
        //TODO: confirm these are correct and dont cause the key to be truncated
        4, 34, //34 bytes follow
        4, 32, //octet string follows
      ])
    
    const der = new Uint8Array(a.length + key.length)
    der.set(a)
    der.set(key, a.length)

    return der
}

//TODO: get node id by importing key temporarily and save that to key data

export async function generateIpfsKey(apiUrl)
{
    const ipfs = makeIpfs(apiUrl)
    const keyPair = nacl.sign.keyPair()
    var pem = why(keyPair.secretKey)

    pem = encode(pem)
    pem = "-----BEGIN PRIVATE KEY-----\n" + pem + "\n-----END PRIVATE KEY-----"
    
    const id = await ipfs.getPeerIdFromKey(pem)

    const key = new TextEncoder("utf-8").encode(pem)
    return {key, id}
}

async function generateEncryptionKey(password, salt)
{
    //TODO: normalize password
    password = new TextEncoder("utf-8").encode(password)
    //TODO: make ui for increasing #iters
    return await pbkdf2Async(sha256, password, salt, { c: 100000, dkLen: 32 });
}


export async function encryptIpfsKey(ipfsKey, password)
{
    const salt = nacl.randomBytes(32)
    const encryptionKey = await generateEncryptionKey(password, salt)
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength)
    const encryptedKey = nacl.secretbox(ipfsKey, nonce, encryptionKey)
    
    //TODO: return b64 instead for portability? or just do that when exporting?
    return {
        key: encode(encryptedKey),
        salt: encode(salt),
        nonce: encode(nonce)
    }
}

export async function decryptIpfsKey(ipfsKey, password)
{
    var {key, salt, nonce} = ipfsKey
    key = new Uint8Array(decode(key))
    salt = new Uint8Array(decode(salt))
    nonce = new Uint8Array(decode(nonce))
    
    const encryptionKey = await generateEncryptionKey(password, salt)
    const decryptedKey = nacl.secretbox.open(key, nonce, encryptionKey)
    
    return decryptedKey
}