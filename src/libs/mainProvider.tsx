import * as ethers from 'ethers'
import { Web3Provider as TypeWeb3Provider } from '@ethersproject/providers'
import { FC, useEffect } from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import useWeb3, { Provider as Web3Provider } from './hooks/useWeb3';
import injected from './connectors/injected';
import { Provider as I18nProvider } from './i18nConfig';
import { Provider as TransactionProvider } from './hooks/useTransactionInfo';
import { message } from 'antd';
import '../../src/styles/ant.css'
import { t } from '@lingui/macro';

function getLibrary(provider:any): TypeWeb3Provider {
    const library = new ethers.providers.Web3Provider(provider)
    return library
}

const Inner: FC = ({children}) => {
    const {activate, chainId, error, deactivate} = useWeb3()
    useEffect(() => {
      if (error === undefined) {
        console.log(99999)
         if (chainId === 4) {
           message.warning(t`this is rinkeby`)
         } else if (chainId !== 1 && chainId !== undefined) {
           message.error(t`this is wrong chain`)
         }
        ;(async () => {
          const isAuthorized = await injected.connector.isAuthorized()
          console.log(isAuthorized)
          if (isAuthorized) {
            activate(injected.connector, (error) => {
              deactivate()
              message.error(t`this is wrong chain`)
            }, false)
          }
        })()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chainId])
    return <>{children}</>
}

const MainProvider: FC = ({children}) => {
    return (
        <I18nProvider>
            <Web3ReactProvider getLibrary={getLibrary}>
                <Web3Provider>
                  <TransactionProvider>
                    <Inner> 
                      {children}
                    </Inner>
                  </TransactionProvider>
                </Web3Provider>
            </Web3ReactProvider>
        </I18nProvider>
    )
}

export default MainProvider