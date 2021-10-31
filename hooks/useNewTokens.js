import axios from "axios";
import { useEffect } from "react";
import useSWR from "swr";
import useLocalStorage from './useLocalStorage'

// ALWAYS UPDATE VOLUME OF OLDER AND NEW COINS
export default function useNewTokens() {
  const { data } = useSWR('https://api.dexlab.space/v1/analytics/markets', axios, {
    refreshInterval: 30000
  })
  const [initialTokenList, setInitialTokenList] = useLocalStorage("initialTokenList", null);
  const [newTokenList, setNewTokenList] = useLocalStorage("newTokenList", null);
  console.log(initialTokenList)

  useEffect(() => {
    const newData = data?.data?.data
    if (!initialTokenList) setInitialTokenList(newData)

    const initialTokenListUpdated = newData?.filter(ar => initialTokenList.find(token => (token.pair === ar.pair)))
    initialTokenListUpdated.sort((a, b) => Number(b.todayVolume) - Number(a.todayVolume))
    setInitialTokenList(initialTokenListUpdated)

    const newTokenList = newData?.filter(ar => !initialTokenList.find(rm => (rm.pair === ar.pair)))
    newTokenList.sort((a, b) => Number(b.todayVolume) - Number(a.todayVolume))
    setNewTokenList(newTokenList)

  }, [data])

  return { initialTokenList, newTokenList }
}