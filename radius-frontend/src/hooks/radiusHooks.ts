import {useState, useEffect} from "react"
import * as radius from "../services/radius"
import useFetcher from "./useFetcher"

export const useAccount = (x) => useFetcher(() => radius.account(), x)

export const useRecommended = (x) => useFetcher(() => radius.getRecommended(), x)
