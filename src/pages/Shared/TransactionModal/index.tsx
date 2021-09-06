import { Trans } from '@lingui/macro'
import { FC } from 'react'
import Popup from 'reactjs-popup'
import BaseModal from '../../../components/BaseModal'
import { Loading, Refuse, Success } from '../../../components/Icon'
import useTransactionListCon from '../../../libs/hooks/useTransactionInfo'
import { ETHERSCAN_BASE_URL } from '../../../libs/utils'
import './styles'

export enum TransactionModalType {
    wait = 0,
    success = 1,
    fail = 2,
    eurSuccess = 3
}

export type TransactionModalTokenInfo = {
    tokenName: string,
    tokenValue: string,
    tokenAddress: string
}

const TransactionModal: FC = () => {
    const classPrefix = 'modal-transaction'
    const { showModal, closeModal } = useTransactionListCon()

    const wait = (
        <>
        <Loading className={'animation-spin'}/>
        <p className={`${classPrefix}-text`}><Trans>Wait for confirm</Trans></p>
        </>
    )

    const success = (
        <>
        <Success/>
        <p className={`${classPrefix}-text`}><Trans>Transaction submitted</Trans></p>
        <a href={`${ETHERSCAN_BASE_URL}${showModal.hash}`} target="view_window"><Trans>View on etherscan</Trans></a>
        </>
    )

    const fail = (
        <>
        <Refuse/>
        <p className={`${classPrefix}-text`}><Trans>Transaction declined</Trans></p>
        </>
    )

    const eurSuccess = (
        <>
        <Success/>
        <p className={`${classPrefix}-text`}><Trans>European option Token minted successfully</Trans></p>
        </>
    )
    
    const iconContent = (() => {
        switch (showModal.txType) {
            case TransactionModalType.wait:
                return wait
            case TransactionModalType.success:
                return success
            case TransactionModalType.fail:
                return fail
            case TransactionModalType.eurSuccess:
                return eurSuccess
            default:
                return <></>;
        }
    })()

    return (
        <Popup open={showModal.isShow}>
            <BaseModal onClose={closeModal} classNames={classPrefix} titleName={''}>
                {iconContent}
            </BaseModal>
        </Popup>
    )
}

export default TransactionModal
