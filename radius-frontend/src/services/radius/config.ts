//localstorage config
export const IDENTITIES_STORAGE_KEY = "radiusAccounts"
export const CURRENT_PROFILE_STORAGE_KEY = "radiusCurrentProfile"
export const CURRENT_ACCOUNT_STORAGE_KEY = "radiusCurrentAccount"

//ipfs config
export const DEFAULT_PUBLISH_OPTIONS = {lifetime: "24h", resolve: false}
export const DEFAULT_RESOLVE_OPTIONS = {
  nocache: true,
  recordCount: 5,
  timeout: "5s"
}