import { t, Trans } from '@lingui/macro'
import { FC, MouseEventHandler } from 'react'
import { BackIcon } from '../../../components/Icon'
import LineShowInfo from '../../../components/LineShowInfo'
import MainButton from '../../../components/MainButton'
import MainCard from '../../../components/MainCard'
import ReviewInfo from '../../../components/ReviewInfo'
import '../styles'

type Props = {
    isMint?: boolean
    back: MouseEventHandler<HTMLButtonElement>
}

const OptionsReview: FC<Props> = ({...props}) => {
    const classPrefix = 'optionsReview'
    return (
        <div className={classPrefix}>
            <MainCard classNames={`${classPrefix}-mainCard`}>
                <div className={`${classPrefix}-mainCard-top`}>
                    <button onClick={props.back}><BackIcon/></button>
                    <p><Trans>{props.isMint ? 'Mint Confirm' : 'Close Confirm'}</Trans></p>
                    <button></button>
                </div>
                <ReviewInfo title={props.isMint ? t`Mint amount` : t`Close amount`} value={'23.4657'} name={'DCU'}/>
                {props.isMint ? null : (<ReviewInfo title={t`Expected get `} value={'23.4657'} name={'Margin-ETH2L'}/>)}
                <div className={`${classPrefix}-mainCard-details`}>
                    <p className={`${classPrefix}-mainCard-details-title`}><Trans>Leveraged Token details</Trans></p>
                    <div className={`${classPrefix}-mainCard-details-infoCard`}>
                        <LineShowInfo leftText={t`Type`} rightText={'ETH Long Leveraged Token'}/>
                        <LineShowInfo leftText={t`Number of Option Token`} rightText={'2'}/>
                        <LineShowInfo leftText={t`Strike price`} rightText={'2'}/>
                        <LineShowInfo leftText={t`Exercise time`} rightText={'2'}/>
                        <LineShowInfo leftText={t`Block number`} rightText={'2'}/>
                    </div>
                </div>
                <LineShowInfo leftText={t`Oracle fee`} rightText={'0.01 ETH'}/>
                <MainButton><Trans>{props.isMint ? 'Mint Confirm' : 'Close Confirm'}</Trans></MainButton>
            </MainCard>
        </div>
    )
}

export default OptionsReview
