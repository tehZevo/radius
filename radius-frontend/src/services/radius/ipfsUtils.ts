import {loadKuboApiUrl} from "./settings"
import ipfs from "../ipfs"

//just wrap with the saved ipfs api url
export default function ipfsWithApiUrl()
{
    return ipfs(loadKuboApiUrl())
}