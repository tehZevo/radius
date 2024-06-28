import * as storage from "../../utils/storage"
import * as config from "./config"

export const saveRadius = (radius) => storage.set(config.STORAGE_KEYS.RADIUS, radius)
export const loadRadius = () => storage.get(config.STORAGE_KEYS.RADIUS, config.DEFAULT_RADIUS)

export const saveKuboApiUrl = (kuboUrl) => storage.set(config.STORAGE_KEYS.KUBO_API_URL, kuboUrl)
export const loadKuboApiUrl = () => storage.get(config.STORAGE_KEYS.KUBO_API_URL, config.DEFAULT_KUBO_API_URL)
