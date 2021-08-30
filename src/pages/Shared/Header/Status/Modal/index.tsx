
import { t, Trans } from '@lingui/macro'
import { FC, MouseEventHandler } from 'react'
import BaseModal from '../../../../../components/BaseModal'
import { MetamaskIcon, WalletConnectIcon } from '../../../../../components/Icon'
import MainCard from '../../../../../components/MainCard'
import './styles'

type Props = {
    onClose?: MouseEventHandler<HTMLButtonElement>
}

const Modal: FC<Props> = ({...props}) => {
    const classPrefix = 'modal-status'
    return (
        <BaseModal onClose={props.onClose} classNames={classPrefix} titleName={t`Connect Wallet`}>
            <p className={`${classPrefix}-notice`}><Trans>Please select the method of connecting to the wallet</Trans></p>
            <div className={`${classPrefix}-walletSelect`}>
                <MainCard>
                    <MetamaskIcon/>
                    <p>MetaMask</p>
                </MainCard>
                <MainCard>
                    <WalletConnectIcon/>
                    <p>WalletConnect</p>
                </MainCard>
            </div>
        </BaseModal>
    )
}

export default Modal
