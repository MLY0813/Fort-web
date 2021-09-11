import { Trans } from '@lingui/macro'
import { FC } from 'react'
import { toast } from 'react-toastify'
import { Fail, Success } from '../../../components/Icon'
import { useEtherscanBaseUrl } from '../../../libs/hooks/useEtherscanBaseUrl'
import { TransactionInfoType } from '../../../libs/hooks/useTransactionInfo'
import './styles'

export type TransactionToastInfo = {
    isSuccess: boolean,
    title: string,
    value: string,
    hash: string
}

type Props = {
    info: TransactionToastInfo
}

const TransactionToast: FC<Props> = ({...props}) => {
    const classPrefix = 'transactionToast'
    const icon = props.info.isSuccess ? <Success/> : <Fail/>
    const etherscanBase = useEtherscanBaseUrl()
    
    return (
        <div className={classPrefix}>
            <div className={`${classPrefix}-left`}>
                {icon}
                <div className={`${classPrefix}-left-info`}>
                {props.info.title}
                </div>
            </div>
            <a href={`${etherscanBase}${props.info.hash}`} target="view_window" className={`${classPrefix}-right`}><Trans>View</Trans></a>
        </div>
    )
}

export default TransactionToast

export const notifyTransaction = (txInfo:TransactionInfoType) => {
    const toastInfo: TransactionToastInfo = {
        isSuccess: txInfo.txState === 1 ? true : false,
        title: txInfo.title,
        value: txInfo.info,
        hash: txInfo.hash
    }
    toast(<TransactionToast info={toastInfo}/>, {
        position: toast.POSITION.TOP_RIGHT,
        closeOnClick: false,
        // hideProgressBar: true,
    })
}
