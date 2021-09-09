import { t, Trans } from '@lingui/macro'
import { FC } from 'react'
import LineShowInfo from '../../components/LineShowInfo'
import MainCard from '../../components/MainCard'
import { tokenList } from '../../libs/constants/addresses'
import './styles'

const Farm: FC = () => {
    const classPrefix = 'farm'
    const farms = [
        {name: 'USDT', address: '0x01'},
        {name: 'USDT', address: '0x02'},
        {name: 'USDT', address: '0x03'},
        {name: 'USDT', address: '0x04'},
        {name: 'USDT', address: '0x05'},
        {name: 'USDT', address: '0x06'}
    ].map((item) => {
        const TokenIcon = tokenList[item.name].Icon
        const StakeButton = (
            <div className={'stake-button'}>
                <div className={'stake-button-inputView'}>
                    <div className={'stake-button-inputView-input'}>
                        <input />
                        <button>MAX</button>
                    </div>
                    <button>Confirm</button>
                </div>
                <p>wallet: 20,000 USDT</p>
            </div>
        )
        return (
            <li key={item.address}>
            <MainCard>
                <div className={`${classPrefix}-li-tokenInfo`}>
                    <TokenIcon/>
                    <p>{item.name}</p>
                </div>
                <div className={`${classPrefix}-middleInfo`}>
                    <LineShowInfo leftText={t`Lock period`} rightText={`1 Month`}/>
                    <LineShowInfo leftText={t`Current mining rate`} rightText={`0.03 FORT/USDT`}/>
                    <LineShowInfo leftText={t`Staking number`} rightText={`172,218.26 USDT`}/>
                    <LineShowInfo leftText={t`Mining pool number`} rightText={`10,000,000,00 FORT`}/>
                </div>
                <div className={`${classPrefix}-bottomInfo`}>
                    <LineShowInfo leftText={t`My staking`} rightText={`12.483 USDT`}/>
                    <LineShowInfo leftText={t`Expected mining`} rightText={`172,218.26 FORT`}/>
                    <LineShowInfo leftText={t`Reward claim time`} rightText={`2021-11-31 12:00`}/>
                </div>
                {StakeButton}
            </MainCard>
        </li>
        )
    })
    return (
        <div className={classPrefix}>
            {/* <div className={`${classPrefix}-circleInfo`}>
                <div className={`${classPrefix}-circleInfo-one`}>
                    <p className={`${classPrefix}-circleInfo-value`}>$ 2,037,482</p>
                    <p><Trans>FORT Price</Trans></p>
                </div>
                <div className={`${classPrefix}-circleInfo-two`}>
                    <p className={`${classPrefix}-circleInfo-value`}>$ 0.7654</p>
                    <p><Trans>FORT Price</Trans></p>
                </div>
                <div className={`${classPrefix}-circleInfo-three`}>
                    <p className={`${classPrefix}-circleInfo-value`}>1,038,294</p>
                    <p><Trans>Fort Current</Trans></p>
                </div>
                <div className={`${classPrefix}-circleInfo-four`}>
                    <p className={`${classPrefix}-circleInfo-value`}>3,674,921</p>
                    <p><Trans>Fort Mine</Trans></p>
                </div>
            </div> */}
            <ul>
                {farms}
            </ul>
        </div>
    )
}

export default Farm
