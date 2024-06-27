import {useState, useEffect} from "react"
import * as radius from "../services/radius"
import useFetcher from "./useFetcher"

export const useAccount = (x=null) => useFetcher(() => radius.getUserId(), x)

// export const useRecommended = (x) => useFetcher(() => radius.getRecommended(), x)

export function useRecommended()
{
    const account = useAccount()
    const [recommended, setRecommended] = useState([])
    
    useEffect(() =>
    {
        if(account == null)
        {
            return
        }

        //TODO: dont hardcode radius
        radius.getRecommended(account, 3).then((r) => setRecommended(r))
    }, [account])

    return recommended
}

export const useClientRadius = (x) => useFetcher(() => radius.getRadius(), x)

export const useRadius = () => ({
    useProfile: (userId) => useFetcher(() => radius.getProfile(userId)),
    useAccount: () => radius.getUserId()
})