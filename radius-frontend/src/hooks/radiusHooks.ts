import * as radius from "../services/radius"
import useFetcher from "./useFetcher"
import useGetterSetter from "./useGetterSetter"

export const useAccount = (x=null) => useFetcher(() => radius.getUserId(), x)

export const useRadius = () => ({
    useRecommended: (userId, r) => useFetcher(() => radius.getRecommended(userId, r), []),
    useProfile: (userId) => useFetcher(() => radius.getProfile(userId)),
    useAccount: () => radius.getUserId(),
    useKuboApiUrl: () => useGetterSetter(
        () => radius.loadKuboApiUrl(),
        (apiUrl) => radius.saveKuboApiUrl(apiUrl)
    ),
    useReplies: (postId) => useFetcher(() => radius.getReplies(postId), []),
})