import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { FC, MouseEventHandler } from 'react'
import { BackIcon } from '../../../components/Icon'
import LineShowInfo from '../../../components/LineShowInfo'
import MainButton from '../../../components/MainButton'
import MainCard from '../../../components/MainCard'
import ReviewInfo from '../../../components/ReviewInfo'
import { useFortEuropeanOptionExercise, useFortEuropeanOptionOpen } from '../../../contracts/hooks/useFortEuropeanOptionTransation'
import { tokenList } from '../../../libs/constants/addresses'
import { bigNumberToNormal } from '../../../libs/utils'
import { OptionsInfo } from '../../Options'
import '../styles'

type Props = {
    isMint?: boolean
    back: MouseEventHandler<HTMLButtonElement>
    optionsInfo: OptionsInfo | undefined
}

const OptionsReview: FC<Props> = ({...props}) => {
    const classPrefix = 'optionsReview'
    if (!props.optionsInfo) {
        throw Error('OptionsReview:no info')
    }
    if (props.optionsInfo.optionToken === undefined && !props.isMint) {
        throw Error('OptionsReview:no optionToken')
    }

    const open = useFortEuropeanOptionOpen(
        'ETH', 
        BigNumber.from(props.optionsInfo.strikePrice), 
        props.optionsInfo.type, 
        BigNumber.from(props.optionsInfo.blockNumber), 
        props.optionsInfo.fortAmount)
    
    const close = useFortEuropeanOptionExercise(
        props.optionsInfo.optionToken!,
        props.optionsInfo.optionTokenAmount
    )
    return (
        <div className={classPrefix}>
            <MainCard classNames={`${classPrefix}-mainCard`}>
                <div className={`${classPrefix}-mainCard-top`}>
                    <button onClick={props.back}><BackIcon/></button>
                    <p><Trans>{props.isMint ? 'Mint Confirm' : 'Close Confirm'}</Trans></p>
                    <button></button>
                </div>
                <ReviewInfo 
                title={props.isMint ? t`Mint amount` : t`Close amount`} 
                value={bigNumberToNormal(BigNumber.from(props.isMint ? props.optionsInfo.fortAmount : props.optionsInfo.optionTokenAmount))} 
                name={props.isMint ? 'DCU' : props.optionsInfo?.optionTokenName || ''}/>
                {props.isMint ? null : (<ReviewInfo title={t`Expected get `} value={bigNumberToNormal(props.optionsInfo?.fortAmount)} name={'DCU'}/>)}
                <div className={`${classPrefix}-mainCard-details`}>
                    <p className={`${classPrefix}-mainCard-details-title`}><Trans>Leveraged Token details</Trans></p>
                    <div className={`${classPrefix}-mainCard-details-infoCard`}>
                        <LineShowInfo leftText={t`Type`} rightText={props.optionsInfo?.type ? 'ETH Long Leveraged Token' : 'ETH Short Leveraged Token'}/>
                        <LineShowInfo leftText={t`Number of Option Token`} rightText={bigNumberToNormal(props.optionsInfo.optionTokenAmount)}/>
                        <LineShowInfo leftText={t`Strike price`} rightText={bigNumberToNormal(BigNumber.from(props.optionsInfo.strikePrice), tokenList['USDT'].decimals)}/>
                        <LineShowInfo leftText={t`Exercise time`} rightText={props.optionsInfo.exerciseTime}/>
                        <LineShowInfo leftText={t`Block number`} rightText={props.optionsInfo.blockNumber.toString()}/>
                    </div>
                </div>
                <LineShowInfo leftText={t`Oracle fee`} rightText={'0.01 ETH'}/>
                <MainButton onClick={props.isMint ? open : close}><Trans>{props.isMint ? 'Mint Confirm' : 'Close Confirm'}</Trans></MainButton>
            </MainCard>
        </div>
    )
}

export default OptionsReview
