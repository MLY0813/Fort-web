import { t, Trans } from '@lingui/macro'
import { FC, MouseEventHandler } from 'react'
import { BackIcon } from '../../../components/Icon'
import MainCard from '../../../components/MainCard'
import ReviewInfo from '../../../components/ReviewInfo'
import './styles'

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
                <ReviewInfo title={t`From`} value={'23.4657'} name={'FORT'}/>
                <ReviewInfo title={t`Expected get `} value={'23.4657'} name={'Margin-ETH2L'}/>
            </MainCard>
        </div>
    )
}

export default LeverReview
