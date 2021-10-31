import axios from "axios";
import { useEffect } from "react";
import useSWR from "swr";
import useLocalStorage from './useLocalStorage'

// ALWAYS UPDATE VOLUME OF OLDER AND NEW COINS
export default function useShitcoins() {
  const { data, mutate, isValidating } = useSWR('https://api.dexlab.space/v1/analytics/markets', axios, {
    refreshInterval: 15000
  })
  const [initialTokenList, setInitialTokenList] = useLocalStorage("initialTokenList", null);
  const [newTokenList, setNewTokenList] = useLocalStorage("newTokenList", null);

  useEffect(() => {
    const newData = data?.data?.data
    const initialTokenListUpdated = initialTokenList ? newData?.filter(ar => initialTokenList?.find(token => (token.pair === ar.pair))) : newData
    if (initialTokenListUpdated) {
      initialTokenListUpdated?.sort((a, b) => Number(b.todayVolume) - Number(a.todayVolume))
      setInitialTokenList(initialTokenListUpdated)
    }
    const newTokenList = newData?.filter(ar => !initialTokenListUpdated?.find(rm => (rm.pair === ar.pair)))
    if (newTokenList) {
      newTokenList?.sort((a, b) => Number(b.todayVolume) - Number(a.todayVolume))
      setNewTokenList(newTokenList)
    }
  }, [data])

  const removeFromNewListAddToInitialList = (pair) => {
    const pairFound = newTokenList.find((token) => token.pair === pair)
    setNewTokenList(newTokenList.filter((token) => token.pair !== pair))
    const cloneInitialList = [...initialTokenList, pairFound]
    cloneInitialList.sort((a, b) => Number(b.todayVolume) - Number(a.todayVolume))
    setInitialTokenList(cloneInitialList)
  }

  return {
    initialTokenList,
    newTokenList,
    updateData: mutate,
    isUpdating: isValidating,
    removeFromNewListAddToInitialList
  }
}