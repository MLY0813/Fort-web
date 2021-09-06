import { BigNumber } from "@ethersproject/bignumber"
import { t, Trans } from '@lingui/macro'
import classNames from 'classnames'
import moment from "moment"
import { FC, useEffect, useMemo, useState } from 'react'
import { OptionsInfo } from ".."
import { CopyIcon, NoOptionToken, OptionLiChoose, TokenFORTBig } from '../../../components/Icon'
import LineShowInfo from '../../../components/LineShowInfo'
import MainButton from '../../../components/MainButton'
import MainCard from '../../../components/MainCard'
import { SingleTokenShow } from '../../../components/TokenShow'
import { tokenList } from "../../../libs/constants/addresses"
import { FortOptionToken } from '../../../libs/hooks/useContract'
import copy from 'copy-to-clipboard'
import useWeb3 from '../../../libs/hooks/useWeb3'
import { bigNumberToNormal, normalToBigNumber, showEllipsisAddress } from "../../../libs/utils"
import './styles'
import { Link } from "react-router-dom"

type Props = {
    reviewCall: (info: OptionsInfo, isMint: boolean) => void
}

const CloseOptions: FC<Props> = ({...props}) => {
    const classPrefix = 'options-closeOptions'
    const {chainId, account, library} = useWeb3()
    const [selectToken, setSelectToken] = useState<string>()
    const [closeButtonDis, setCloseButtonDis] = useState<boolean>()
    const [optionInfo, setOptionInfo] = useState<OptionsInfo | null>()
    var cache = localStorage.getItem("optionTokensList" + chainId?.toString())
    var optionTokenList = useMemo(() => cache ? JSON.parse(cache) : [], [cache])
    const routes = optionTokenList.map((item: any) => (
        <li key={item.address} className={classNames({
            selected: item.address === selectToken,
          })} onClick={() => setSelectToken(item.address)}>
            <SingleTokenShow tokenNameOne={item.name} isBold/>
            <OptionLiChoose/>
        </li>
    ))
    
    const optionTokenContracts = optionTokenList.map((item: any) => FortOptionToken(item.address))

    useEffect(() => {
        if (selectToken) {
            const tokenName:string = optionTokenList.filter((item:any) => selectToken === item.address)[0].name
            const selectTokenContract = optionTokenContracts.filter((item:any) => selectToken === item.address)[0]
            setCloseButtonDis(true)
            ;(async () => {
                console.log(4444)
                const tokenInfo = await selectTokenContract.getOptionInfo()
                const balance = await selectTokenContract.balanceOf(account)
                const latestBlock = await library?.getBlockNumber()
                const endBlock = BigNumber.from(tokenInfo[3])
                const subBlock = endBlock.sub(BigNumber.from(latestBlock))
                const nowTime = moment().valueOf() + subBlock.mul(13000).toNumber()
                const newOptionInfo:OptionsInfo = {
                    fortAmount: normalToBigNumber('203'),
                    optionTokenAmount: BigNumber.from(balance),
                    optionToken: selectTokenContract.address,
                    optionTokenName: tokenName,
                    type: tokenInfo[2],
                    strikePrice: BigNumber.from(tokenInfo[1]),
                    exerciseTime: moment(nowTime).format('YYYY[-]MM[-]DD hh:mm:ss'),
                    blockNumber: endBlock
                }
                setOptionInfo(newOptionInfo)
                setCloseButtonDis(false)
            })()
        } else {
            if (optionTokenContracts.length > 0) {
                setSelectToken(optionTokenContracts[0].address)
            }
        }
    }, [account, library, selectToken])

    return optionTokenContracts.length > 0 ? (
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
                    <LineShowInfo leftText={t`Type`} rightText={optionInfo?.type ? t`ETH call option Token` : t`ETH put option Token`}/>
                    <LineShowInfo leftText={t`Number of Option Token`} rightText={optionInfo ? bigNumberToNormal(optionInfo.optionTokenAmount) : '--.--'}/>
                    <LineShowInfo leftText={t`Strike price`} rightText={optionInfo ? bigNumberToNormal(optionInfo.strikePrice, tokenList['USDT'].decimals) : '--.--'}/>
                    <LineShowInfo leftText={t`Exercise time`} rightText={optionInfo ? optionInfo.exerciseTime : '----'}/>
                    <LineShowInfo leftText={t`Block number`} rightText={optionInfo ? optionInfo.blockNumber.toString() : '----'}/>
                    <div className={`${classPrefix}-rightCard-topInfo-lastAddress`}>
                        <LineShowInfo leftText={t`Contract address`} rightText={optionInfo ? showEllipsisAddress(optionInfo.optionToken) : '----'}/>
                        <button className={'copyButton'} onClick={() => copy(optionInfo ? optionInfo.optionToken : '')}><CopyIcon/></button>
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
                    <MainButton disable={closeButtonDis} onClick={() => !closeButtonDis ? props.reviewCall(optionInfo!, false) : null}><Trans>Close</Trans></MainButton>
                </div>
            </MainCard>
        </div>
    ) : (
        <MainCard classNames={`noOptionToken`}>
            <NoOptionToken/>
            <p><Trans>No option Token</Trans></p>
            <MainButton><Link to={'/options/mint'}><Trans>Go to Mint</Trans></Link></MainButton>
        </MainCard>
    )
}

export default CloseOptions
