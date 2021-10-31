import Head from 'next/head'
import useNewTokens from '../hooks/useNewTokens'
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon, ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/outline'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  const { initialTokenList, newTokenList } = useNewTokens()
  return (
    <div>
      <Head>
        <title>DEXLAB SHITCOIN MONITOR</title>
        <meta name="description" content="Monitor newly added shitcoins" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-center items-center">

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
                          return <p className="text-base text-gray-200 font-bold"
                            key={token.pair}>
                            {token.pair} | TODAY VOLUME: {token.todayVolume}
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

        <h1 className="font-medium text-gray-200">NEW TOKEN LIST</h1>
        {newTokenList?.map((token) => {
          return <p className="text-base text-red-500 font-bold flex justify-center my-5 space-x-5"
            key={token.pair}>
            <span>{token.pair} | TODAY VOLUME: {token.todayVolume}</span>

            <button
              type="button"
              className="text-green-300"><CheckCircleIcon className="h-6 w-6" /></button>
          </p>
        })}

        <h1 className="font-medium text-gray-200">
          VOLUME SPIKE TOKEN SPIKE (LAST FEW MINUTES) - WIP
        </h1>

      </main >
    </div >
  )
}
