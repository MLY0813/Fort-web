import { t, Trans } from '@lingui/macro'
import classNames from 'classnames'
import { FC, useState } from 'react'
import { CopyIcon, OptionLiChoose, TokenFORTBig } from '../../../components/Icon'
import LineShowInfo from '../../../components/LineShowInfo'
import MainButton from '../../../components/MainButton'
import MainCard from '../../../components/MainCard'
import { SingleTokenShow } from '../../../components/TokenShow'
import './styles'

const CloseOptions: FC = () => {
    const classPrefix = 'options-closeOptions'
    const [selectToken, setSelectToken] = useState<string>()
    const routes = [
        {name: 'OptionCall-ETH3000-37484858', address: '0x01'},
        {name: 'OptionCall-ETH3000-37484858', address: '0x02'},
        {name: 'OptionCall-ETH3000-37484858', address: '0x03'},
        {name: 'OptionCall-ETH3000-37484858', address: '0x04'},
        {name: 'OptionCall-ETH3000-37484858', address: '0x05'},
        {name: 'OptionCall-ETH3000-37484858', address: '0x06'},
        {name: 'OptionCall-ETH3000-37484858', address: '0x07'},
        {name: 'OptionCall-ETH3000-37484858', address: '0x08'},
        {name: 'OptionCall-ETH3000-37484858', address: '0x09'},
        {name: 'OptionCall-ETH3000-37484858', address: '0x010'},
        {name: 'OptionCall-ETH3000-37484858', address: '0x011'},
        {name: 'OptionCall-ETH3000-37484858', address: '0x012'},
    ].map((item) => (
        <li key={item.address} className={classNames({
            selected: item.address === selectToken,
          })} onClick={() => setSelectToken(item.address)}>
            <SingleTokenShow tokenNameOne={item.name} isBold/>
            <OptionLiChoose/>
        </li>
    ))
    return (
        <div className={classPrefix}>
            <MainCard classNames={`${classPrefix}-leftCard`}>
                <p className={`${classPrefix}-leftCard-title`}><Trans>Option Token held</Trans></p>
                <ul>
                    {routes}
                </ul>
                <div className={`${classPrefix}-leftCard-addToken`}>
                    <button><Trans>+ Add option Token</Trans></button>
                </div>
            </MainCard>
            <MainCard classNames={`${classPrefix}-rightCard`}>
                <div className={`${classPrefix}-rightCard-topInfo`}>
                    <LineShowInfo leftText={t`Type`} rightText={t`ETH call option Token`}/>
                    <LineShowInfo leftText={t`Number of Option Token`} rightText={t`1232.4756`}/>
                    <LineShowInfo leftText={t`Strike price`} rightText={t`1722.26 USDT`}/>
                    <LineShowInfo leftText={t`Exercise time`} rightText={t`12-23 12:23`}/>
                    <LineShowInfo leftText={t`Block number`} rightText={t`48474884`}/>
                    <div className={`${classPrefix}-rightCard-topInfo-lastAddress`}>
                        <LineShowInfo leftText={t`Contract address`} rightText={t`0xb21e...e6b8b3`}/>
                        <button className={'copyButton'}><CopyIcon/></button>
                    </div>
                </div>
                <div className={`${classPrefix}-rightCard-bottomInfo`}>
                    <p className={`${classPrefix}-rightCard-bottomInfo-title`}><Trans>Expected get after close</Trans></p>
                    <TokenFORTBig/>
                    <div className={`${classPrefix}-rightCard-bottomInfo-fortNum`}>
                        <div className={`${classPrefix}-rightCard-bottomInfo-fortNum-value`}>
                            23.2345353
                            <span className={`${classPrefix}-rightCard-bottomInfo-fortNum-name`}>FORT</span>
                        </div>
                    </div>
                    <MainButton><Trans>Close</Trans></MainButton>
                </div>
            </MainCard>
        </div>
    )
}

export default CloseOptions
