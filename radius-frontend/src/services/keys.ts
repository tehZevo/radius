import nacl from "tweetnacl"
import {pbkdf2Async} from "@noble/hashes/pbkdf2"
import { sha256 } from '@noble/hashes/sha256';
import {encode} from "base64-arraybuffer"

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


export async function generateIpfsKey()
{
    const keyPair = nacl.sign.keyPair()
    var pem = why(keyPair.secretKey)

    pem = encode(pem)
    pem = "-----BEGIN PRIVATE KEY-----\n" + pem + "\n-----END PRIVATE KEY-----"
    
    return new TextEncoder("utf-8").encode(pem)
}

async function generateEncryptionKey(password)
{
    const salt = nacl.randomBytes(32)
    //TODO: make ui for increasing #iters
    const encryptionKey = await pbkdf2Async(sha256, password, salt, { c: 100000, dkLen: 32 });

    return [salt, encryptionKey]
}


export async function encryptIpfsKey(ipfsKey, encryptionKey)
{
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength)
    const encryptedKey = nacl.secretbox(ipfsKey, nonce, encryptionKey)
    
    return [nonce, encryptedKey]
}

export async function generateIdentity(password)
{
    const ipfsKey = await generateIpfsKey()
    const [salt, encryptionKey] = await generateEncryptionKey(password)
    const [nonce, encryptedIdentity] = await encryptIpfsKey(ipfsKey, encryptionKey)
    
    return [encode(encryptedIdentity), encode(salt), encode(nonce)]
}