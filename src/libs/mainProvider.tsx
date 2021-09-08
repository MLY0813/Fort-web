import * as ethers from 'ethers'
import { Web3Provider as TypeWeb3Provider } from '@ethersproject/providers'
import { FC, useEffect } from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import useWeb3, { Provider as Web3Provider } from './hooks/useWeb3';
import injected from './connectors/injected';
import { Provider as I18nProvider } from './i18nConfig';
import { Provider as TransactionProvider } from './hooks/useTransactionInfo';
import { message } from 'antd';
import { t } from '@lingui/macro';

function getLibrary(provider:any): TypeWeb3Provider {
    const library = new ethers.providers.Web3Provider(provider)
    return library
}

const Inner: FC = ({children}) => {
    const {activate, chainId} = useWeb3()
   
    useEffect(() => {
      if (chainId) {
         if (chainId === 4) {
           message.warning(t`this is rinkeby`)
         } else {
           message.error(t`this is wrong chain`)
         }
        ;(async () => {
          const isAuthorized = await injected.connector.isAuthorized()
          if (isAuthorized) {
            activate(injected.connector, undefined, true)
          }
        })()
      } else {
        message.error(t`this is wrong chain`)
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