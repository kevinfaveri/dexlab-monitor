import Head from 'next/head'
import useShitcoins from '../hooks/useShitcoins'
import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon, CheckCircleIcon, RefreshIcon } from '@heroicons/react/outline'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function Home() {
  const {
    initialTokenList,
    newTokenList,
    updateData,
    isUpdating,
    volumeBelow,
    setVolumeBelow,
    shitCoinRocketList,
    removeFromNewListAddToInitialList
  } = useShitcoins()

  return (
    <div>
      <Head>
        <title>DEXLAB SHITCOIN MONITOR</title>
        <meta name="description" content="Monitor newly added shitcoins" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex justify-end">
        <button type="button" onClick={updateData}>
          <RefreshIcon className={`${isUpdating ? 'animate animate-spin' : ''} text-blue-500 h-10 w-10 m-5`} />
        </button>
      </div>
      <main className="flex flex-col justify-center items-center divide-y-4 divide-light-200 space-y-5">


        <div>
          <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
              <dl className="mt-6 space-y-6 divide-y divide-gray-200">
                <Disclosure as="div" className="pt-6">
                  {({ open }) => (
                    <>
                      <dt className="text-lg">
                        <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                          <span className="font-medium text-gray-200">COMPLETE TOKEN LIST</span>
                          <span className="ml-6 h-7 flex items-center">
                            <ChevronRightIcon
                              className={classNames(open ? 'rotate-90' : 'rotate-0', 'h-6 w-6 transform transition-all')}
                              aria-hidden="true"
                            />
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd" className="mt-2 pr-12">
                        {initialTokenList?.map((token) => {
                          return <p className="text-base text-gray-200 font-bold text-right"
                            key={token.pair}>
                            {token.pair} | TODAY VOLUME: {formatter.format(token.todayVolume)}
                          </p>
                        })}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </dl>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <h1 className="font-medium text-gray-200">NEW TOKEN LIST</h1>
          {newTokenList?.map((token) => {
            return <p className="text-base text-red-500 font-bold flex justify-end my-5 space-x-5"
              key={token.pair}>
              <span>{token.pair} | TODAY VOLUME: {formatter.format(token.todayVolume)}</span>

              <button
                type="button"
                onClick={() => removeFromNewListAddToInitialList(token.pair)}
                className="text-green-300"><CheckCircleIcon className="h-6 w-6" /></button>
            </p>
          })}
          {newTokenList?.length === 0 && <div className="text-gray-200">No new tokens found</div>}
        </div>

        <div className="pt-5">
          <h1 className="font-medium text-gray-200">
            SHITCOIN TAKING OFF WITH VOLUME BELOW <input
              type="number"
              min="1"
              max="100000000"
              value={volumeBelow}
              onChange={(e) => setVolumeBelow(Number(e.target.value))}
              className="bg-black border-2 border-light-300 text-gray-200" />
          </h1>
          {shitCoinRocketList?.map((token) => {
            return <p className="text-base text-green-500 font-bold flex justify-end my-5 space-x-5"
              key={token.pair}>
              <span>{token.pair} | FROM {formatter.format(token.oldVolume)} TO {formatter.format(token.newVolume)}</span>
            </p>
          })}
        </div>

      </main >
    </div >
  )
}
