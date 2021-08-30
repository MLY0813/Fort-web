import { Trans } from '@lingui/macro'
import classNames from 'classnames'
import { FC, useRef } from 'react'
import Popup from 'reactjs-popup'
import MainButton from '../../../../components/MainButton'
import useWeb3 from '../../../../libs/hooks/useWeb3'
import { showEllipsisAddress } from '../../../../libs/utils'
import Modal from './Modal'
import './styles'

const ConnectStatus: FC = () => {
    const { account } = useWeb3()
    const modal = useRef<any>()
    const classPrefix = 'connectStatus'
    return (
        <div className={classNames({
            [`${classPrefix}`]: true,
            [`isConnect`]: false
        })}>
            <div className={`${classPrefix}-chainName`}>Rinkeby</div>
            {account === undefined ?
             (<Popup
                modal
                ref={modal}
                trigger={
                    <button className={'fort-button'}><Trans>Connect Wallet</Trans></button>
                }>
                <Modal onClose={() => modal.current.close()}/>
              </Popup>) : 
             (<MainButton>{showEllipsisAddress(account!)}</MainButton>)}
        </div>
    )
}

export default ConnectStatus
