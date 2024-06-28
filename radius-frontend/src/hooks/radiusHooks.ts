import * as radius from "../services/radius"
import useFetcher from "./useFetcher"

export const useAccount = (x=null) => useFetcher(() => radius.getUserId(), x)

export const useClientRadius = (x) => useFetcher(() => radius.getRadius(), x)

export const useRadius = () => ({
    useRecommended: (userId, r) => useFetcher(() => radius.getRecommended(userId, r), []),
    useProfile: (userId) => useFetcher(() => radius.getProfile(userId)),
    useAccount: () => radius.getUserId()
})