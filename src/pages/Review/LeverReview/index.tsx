import { t, Trans } from '@lingui/macro'
import { BigNumber } from 'ethers'
import { FC, MouseEventHandler } from 'react'
import { BackIcon } from '../../../components/Icon'
import LineShowInfo from '../../../components/LineShowInfo'
import MainButton from '../../../components/MainButton'
import MainCard from '../../../components/MainCard'
import ReviewInfo from '../../../components/ReviewInfo'
import { useFortLeverBuy } from '../../../contracts/hooks/useFortLeverTransation'
import { normalToBigNumber, ZERO_ADDRESS } from '../../../libs/utils'
import '../styles'

export type LeverReviewModel = {
    fromToken: string,
    fromNum: string,
    getToken: string,
    getNum: string,
    frontPrice?: string,
    price: string,
}

type Props = {
    model: LeverReviewModel
    back: MouseEventHandler<HTMLButtonElement>
}

const LeverReview: FC<Props> = ({...props}) => {
    const classPrefix = 'leverReview'
    var details_type: boolean
    var details_factor: string = ''
    if (props.model.fromToken === 'DCU') {
        const strLength = props.model.getToken.length
        details_type = props.model.getToken[strLength - 1] === 'L' ? true : false
        details_factor = props.model.getToken[strLength - 2]
    } else {
        const strLength = props.model.fromToken.length
        details_type = props.model.fromToken[strLength - 1] === 'L' ? true : false
        details_factor = props.model.fromToken[strLength - 2]
    }
    
    const buy = useFortLeverBuy(ZERO_ADDRESS, BigNumber.from(details_factor), details_type, normalToBigNumber(props.model.fromNum))
    return (
        <div className={classPrefix}>
            <MainCard classNames={`${classPrefix}-mainCard`}>
                <div className={`${classPrefix}-mainCard-top`}>
                    <button onClick={props.back}><BackIcon/></button>
                    <p><Trans>Swap Confirm</Trans></p>
                    <button></button>
                </div>
                {props.model.fromToken === 'DCU' ? (
                <div className={`${classPrefix}-mainCard-fortNot`}>
                    <Trans>If you already hold the Leveraged Token, it will be merged on transaction</Trans>
                </div>) : null}
                
                <ReviewInfo title={t`From`} value={props.model.fromNum} name={props.model.fromToken}/>
                <ReviewInfo title={t`Expected get `} value={props.model.getNum} name={props.model.getToken}/>
                <div className={`${classPrefix}-mainCard-details`}>
                    <p className={`${classPrefix}-mainCard-details-title`}><Trans>Leveraged Token details</Trans></p>
                    <div className={`${classPrefix}-mainCard-details-infoCard`}>
                        <LineShowInfo leftText={t`Type`} rightText={details_type ? t`ETH Long Leveraged Token` : t`ETH Short Leveraged Token`}/>
                        <LineShowInfo leftText={t`Leverage factor`} rightText={details_factor}/>
                    </div>
                </div>
                <LineShowInfo leftText={t`Current price`} rightText={`1 ETH = ${props.model.price} USDT`}/>
                <LineShowInfo leftText={t`Oracle fee`} rightText={'0.01 ETH'}/>
                <MainButton onClick={buy}><Trans>Swap Confirm</Trans></MainButton>
            </MainCard>
        </div>
    )
}

export default LeverReview
