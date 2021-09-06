import { Trans } from '@lingui/macro'
import classNames from 'classnames'
import { FC, useRef } from 'react'
import Popup from 'reactjs-popup'
import { SupportedChains } from '../../../../libs/constants/chain'
import useWeb3 from '../../../../libs/hooks/useWeb3'
import { showEllipsisAddress } from '../../../../libs/utils'
import Modal from './Modal'
import './styles'
import WalletModal from './WalletModal'

const ConnectStatus: FC = () => {
    const { account, chainId } = useWeb3()
    const modal = useRef<any>()
    const thisChain = SupportedChains.filter((item) => item.chainId === chainId)[0]
    const classPrefix = 'connectStatus'
    return (
        <div className={classNames({
            [`${classPrefix}`]: true,
            [`isConnect`]: false
        })}>
            {thisChain !== undefined ? (<div className={`${classPrefix}-chainName`}>{thisChain.name}</div>) : null}
            
            {account === undefined ?
             (<Popup
                modal
                ref={modal}
                trigger={
                    <button className={'fort-button'}><Trans>Connect Wallet</Trans></button>
                }>
                <Modal onClose={() => modal.current.close()}/>
              </Popup>) : 
             (<Popup
                modal
                ref={modal}
                trigger={
                    <button className={'fort-button'}>{showEllipsisAddress(account || '')}</button>
                }>
                <WalletModal onClose={() => modal.current.close()}/>
              </Popup>)}
        </div>
    )
}

export default ConnectStatus
