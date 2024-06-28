import * as storage from "../../utils/storage"
import makeIpfs from "./ipfsUtils"
import * as keys from "../keys"
import ppcl from "./ppcl"
import * as config from "./config"
import {Profile, getProfile, createNewProfile} from "./profile"

//TODO: replace
export const logout = () => ppcl("logout")

//TODO: replace
export const setName = (name) => ppcl("setName", name)

export const getIdentities = () => storage.get(config.STORAGE_KEYS.IDENTITIES, {})
export const getCurrentProfile = () => storage.get(config.STORAGE_KEYS.CURRENT_PROFILE)
export const getCurrentAccount = () => storage.get(config.STORAGE_KEYS.CURRENT_ACCOUNT)
export const saveCurrentProfile = (profile) => storage.set(config.STORAGE_KEYS.CURRENT_PROFILE, profile)
export const saveCurrentAccount = (account) => storage.set(config.STORAGE_KEYS.CURRENT_ACCOUNT, account)

//TODO: rename to importIdentity
export async function importAccount(name, id, key)
{
  const accounts = getIdentities()
  //TODO: check if name already exists
  accounts[name] = {name, id, key}
  storage.set(config.STORAGE_KEYS.IDENTITIES, accounts)
}

export const getUserId = () => getCurrentProfile()?.id

export async function login(name, password)
{
  const ipfs = makeIpfs()
  //load key
  const accounts = getIdentities()
  //TODO: check if exists first
  const {id, key} = accounts[name]
  //decrypt key
  const decryptedKey = await keys.decryptIpfsKey(key, password)

  //import key into ipfs
  await ipfs.removeKey(name)
  await ipfs.importKey(name, decryptedKey)
  saveCurrentAccount(name)
  
  var profile: Profile
  try
  {
    profile = await getProfile(id)
  }
  //TODO: dont swallow all exceptions
  catch
  {
    profile = createNewProfile(id)
    await publishProfile(name, profile)
  }

  saveCurrentProfile(profile)
}

//TODO: this should be named wipeProfile
export async function wipeAccount(yesIReallyMeanIt=false)
{
  if(!yesIReallyMeanIt)
  {
    console.log("You didn't really mean it.")
    return
  }
  
  console.log("Wiping account...")
  const oldProfile = getCurrentProfile()
  const newProfile = createNewProfile(oldProfile.id)
  await saveAndPublishProfile(newProfile)
  console.log("Done.")
}

export async function publishProfile(keyName, profile)
{
  const ipfs = makeIpfs()
  const cid = await ipfs.writeJson(profile)
  
  return ipfs.publish(keyName, cid, config.DEFAULT_PUBLISH_OPTIONS)
}

export async function saveAndPublishProfile(profile)
{
  const account = getCurrentAccount()
  saveCurrentProfile(profile)
  const ipnsName = await publishProfile(account, profile)
  console.log("Profile saved and published to", ipnsName)

  return ipnsName
}