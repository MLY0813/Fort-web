import { t, Trans } from '@lingui/macro'
import { FC, MouseEventHandler } from 'react'
import { BackIcon } from '../../../components/Icon'
import LineShowInfo from '../../../components/LineShowInfo'
import MainButton from '../../../components/MainButton'
import MainCard from '../../../components/MainCard'
import ReviewInfo from '../../../components/ReviewInfo'
import '../styles'

type Props = {
    back: MouseEventHandler<HTMLButtonElement>
}

const LeverReview: FC<Props> = ({...props}) => {
    const classPrefix = 'leverReview'
    return (
        <div className={classPrefix}>
            <MainCard classNames={`${classPrefix}-mainCard`}>
                <div className={`${classPrefix}-mainCard-top`}>
                    <button onClick={props.back}><BackIcon/></button>
                    <p><Trans>Swap Confirm</Trans></p>
                    <button></button>
                </div>
                <div className={`${classPrefix}-mainCard-fortNot`}><Trans>If you already hold the Leveraged Token, it will be merged on transaction</Trans></div>
                <ReviewInfo title={t`From`} value={'23.4657'} name={'FORT'}/>
                <ReviewInfo title={t`Expected get `} value={'23.4657'} name={'Margin-ETH2L'}/>
                <div className={`${classPrefix}-mainCard-details`}>
                    <p className={`${classPrefix}-mainCard-details-title`}><Trans>Leveraged Token details</Trans></p>
                    <div className={`${classPrefix}-mainCard-details-infoCard`}>
                        <LineShowInfo leftText={t`Type`} rightText={'ETH Long Leveraged Token'}/>
                        <LineShowInfo leftText={t`Leverage factor`} rightText={'2'}/>
                    </div>
                </div>
                <LineShowInfo leftText={t`Buying price`} rightText={'1 ETH = 2364.575869 USDT'}/>
                <LineShowInfo leftText={t`Current price`} rightText={'1 ETH = 2364.575869 USDT'}/>
                <LineShowInfo leftText={t`Oracle fee`} rightText={'0.01 ETH'}/>
                <MainButton><Trans>Swap Confirm</Trans></MainButton>
            </MainCard>
        </div>
    )
}

export default LeverReview
