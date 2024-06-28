import * as storage from "../../utils/storage"
import ppcl from "./ppcl"
import * as config from "./config"
import {Profile, getProfile, createNewProfile} from "./profile"
import * as ipfs from "../ipfs"

//TODO: replace
export const logout = () => ppcl("logout")

//TODO: replace
export const setName = (name) => ppcl("setName", name)

export const getIdentities = () => storage.get(config.IDENTITIES_STORAGE_KEY, {})
export const getCurrentProfile = () => storage.get(config.CURRENT_PROFILE_STORAGE_KEY)
export const getCurrentAccount = () => storage.get(config.CURRENT_ACCOUNT_STORAGE_KEY)
export const saveCurrentProfile = (profile) => storage.set(config.CURRENT_PROFILE_STORAGE_KEY, profile)
export const saveCurrentAccount = (account) => storage.set(config.CURRENT_ACCOUNT_STORAGE_KEY, account)

//TODO: rename to importIdentity
export async function importAccount(name, id, key)
{
  const accounts = getIdentities()
  //TODO: check if name already exists
  accounts[name] = {name, id, key}
  storage.set(config.IDENTITIES_STORAGE_KEY, accounts)
}

export const getUserId = () => getCurrentProfile().id

export async function login(name, password)
{
  //load key
  const accounts = getIdentities()
  //TODO: check if exists first
  const {id, key} = accounts[name]
  //decrypt key
  const decryptedKey = await keys.decryptIpfsKey(key, password)

  //import key into ipfs
  ipfs.removeKey(name)
  ipfs.importKey(name, decryptedKey)
  saveCurrentAccount(name)
  
  var profile: Profile
  try
  {
    profile = await getProfile(id)
  }
  //TODO: dont swallow all exceptions
  catch
  {
    const profile = createNewProfile(id)
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