export const DEFAULT_RADIUS = 3
export const DEFAULT_KUBO_API_URL = "http://127.0.0.1:5001/api/v0"

//localstorage config
export const STORAGE_KEYS = {
  IDENTITIES: "radius_accounts",
  RADIUS: "radius_radius",
  CURRENT_PROFILE: "radius_currentProfile",
  CURRENT_ACCOUNT: "radius_currentAccount",
  KUBO_API_URL: "radius_kuboApiUrl",
}

//ipfs config
export const DEFAULT_PUBLISH_OPTIONS = {
  lifetime: "24h", resolve: false
}

export const DEFAULT_RESOLVE_OPTIONS = {
  nocache: true,
  recordCount: 5,
  timeout: "5s"
}