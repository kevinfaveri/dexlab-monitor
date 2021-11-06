import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useLocalStorage from './useLocalStorage'

function percentage(partialValue, totalValue) {
  return (100 * partialValue) / totalValue;
}

export default function useShitcoins() {
  const [volumeBelow, setVolumeBelow] = useLocalStorage("volumeBelow", 100000);
  const { data, mutate, isValidating } = useSWR('https://api.dexlab.space/v1/analytics/markets', axios, {
    refreshInterval: 30000
  })
  const [initialTokenList, setInitialTokenList] = useLocalStorage("initialTokenList", null);
  const [newTokenList, setNewTokenList] = useLocalStorage("newTokenList", null);
  const [shitCoinRocketList, setShitcoinRocketList] = useState([]);

  useEffect(() => {
    let newData = data?.data?.data
    newData = newData?.filter((token) => token.pair.includes('/USDC') || token.pair.includes('/USDT'))
    const initialTokenListFailProof = (initialTokenList || [])
    let shitCoinRocketListAux = [...shitCoinRocketList]
    if (newData) {
      for (let index = 0; index < initialTokenListFailProof.length; index++) {
        const currentToken = initialTokenListFailProof[index];
        const newVolume = newData.find((token) => token.pair === currentToken.pair).todayVolume
        if (Number(volumeBelow) > Number(newVolume) && Number(newVolume) > Number(currentToken.todayVolume)) {
          const diff = Number(newVolume) - Number(currentToken.todayVolume)
          const percent = percentage(diff, Number(currentToken.todayVolume))
          if (percent > 5 && percent <= 50) {
            const tokenVolObj = {
              pair: currentToken.pair,
              oldVolume: currentToken.todayVolume,
              newVolume
            }
            const foundShitcoin = shitCoinRocketListAux.findIndex((token) => token.pair === currentToken.pair)
            if (foundShitcoin !== -1) shitCoinRocketListAux[foundShitcoin] = tokenVolObj
            else shitCoinRocketListAux.push(tokenVolObj)
          }
        }
      }
    }

    shitCoinRocketListAux?.sort((a, b) => Number(b.newVolume) - Number(a.newVolume))
    setShitcoinRocketList(shitCoinRocketListAux)

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
  }, [data, volumeBelow])

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
    removeFromNewListAddToInitialList,
    volumeBelow,
    setVolumeBelow,
    shitCoinRocketList
  }
}