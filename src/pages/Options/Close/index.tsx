import { BigNumber } from "@ethersproject/bignumber"
import { t, Trans } from '@lingui/macro'
import classNames from 'classnames'
import moment from "moment"
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
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
import { bigNumberToNormal, formatInputAddress, normalToBigNumber, showEllipsisAddress } from "../../../libs/utils"
import './styles'
import { Link } from "react-router-dom"
import { Contract } from "ethers"
import ERC20ABI from '../../../contracts/abis/ERC20.json'
import { message } from 'antd';

type Props = {
    reviewCall: (info: OptionsInfo, isMint: boolean) => void
}

const CloseOptions: FC<Props> = ({...props}) => {
    const classPrefix = 'options-closeOptions'
    const {chainId, account, library} = useWeb3()
    const [showAddButton, setShowAddButton] = useState(false)
    const [addAddressValue, setAddAddressValue] = useState('')
    const [latestBlock, setLatestBlock] = useState(0)
    const [selectToken, setSelectToken] = useState<string>()
    const [closeButtonDis, setCloseButtonDis] = useState<boolean>()
    const [optionInfo, setOptionInfo] = useState<OptionsInfo | null>()
    const [optionTokenList, setOptionTokenList] = useState<Array<{[key:string]:string}>>([])
    
    const routes = optionTokenList ? optionTokenList.reverse().map((item: any, index) => (
        <li key={item.address} className={classNames({
            selected: item.address === selectToken,
          })} onClick={() => setSelectToken(item.address)}>
            <SingleTokenShow tokenNameOne={item.name} isBold/>
            <OptionLiChoose/>
        </li>
    )) : (<></>)
    
    useEffect(() => {
        if (chainId && account && library) {
            var cache = localStorage.getItem("optionTokensList" + chainId?.toString())
            const optionTokenList = cache ? JSON.parse(cache) : []
            setOptionTokenList(optionTokenList)
        }
    }, [chainId, account, library])

    const optionTokenContracts = useMemo(() => optionTokenList.reverse().map((item: any) => FortOptionToken(item.address)), [optionTokenList])

    useEffect(() => {
        if (selectToken) {
            const tokenName:string = optionTokenList.filter((item:any) => selectToken === item.address)[0].name
            const selectTokenContract = optionTokenContracts.filter((item:any) => selectToken === item.address)[0]
            setCloseButtonDis(true)
            ;(async () => {
                const tokenInfo = await selectTokenContract?.getOptionInfo()
                const balance = await selectTokenContract?.balanceOf(account)
                const latestBlock = await library?.getBlockNumber()
                const endBlock = BigNumber.from(tokenInfo[3])
                const subBlock = endBlock.sub(BigNumber.from(latestBlock))
                const nowTime = moment().valueOf() + subBlock.mul(13000).toNumber()
                const newOptionInfo:OptionsInfo = {
                    fortAmount: normalToBigNumber('203'),
                    optionTokenAmount: BigNumber.from(balance),
                    optionToken: selectTokenContract?.address || '',
                    optionTokenName: tokenName,
                    type: tokenInfo[2],
                    strikePrice: BigNumber.from(tokenInfo[1]),
                    exerciseTime: moment(nowTime).format('YYYY[-]MM[-]DD hh:mm:ss'),
                    blockNumber: endBlock
                }
                setLatestBlock(latestBlock || 0)
                setOptionInfo(newOptionInfo)
                setCloseButtonDis((latestBlock || 0) > endBlock.toNumber() ? false : true)
            })()
        } else {
            if (optionTokenContracts.length > 0 && optionTokenContracts[0]) {
                setSelectToken(optionTokenContracts[0].address)
            }
        }
    }, [account, library, selectToken, optionTokenContracts, optionTokenList])

    
    const addToken = useCallback(() => {
        var cache = localStorage.getItem("optionTokensList" + chainId?.toString())
        var optionTokenList = cache ? JSON.parse(cache) : []
        const newTokenAddress = addAddressValue
        if (optionTokenList.filter((item: { address: string }) => item.address === newTokenAddress).length === 0) {
            message.success(t`Option Token add failed`)
            return
        }
        const newTokenContract = new Contract(newTokenAddress, ERC20ABI, library)
        ;(async () => {
            try {
                const newTokenName = await newTokenContract?.name()
                const optionToken = {address: newTokenAddress, name: newTokenName}
                const newOptionTokenList = [...optionTokenList, optionToken]
                localStorage.setItem('optionTokensList' + chainId?.toString(), JSON.stringify(newOptionTokenList))
                setOptionTokenList(newOptionTokenList)
                message.success(t`Option Token add success`)
            } catch {
                message.error(t`Option Token add failed`)
            }
        })()
    },[addAddressValue, chainId, library])

    const addTokenView = (
        <div className={`${classPrefix}-leftCard-addToken-addTokenView`}>
            <input placeholder={t`Input`} value={addAddressValue} onChange={(e) => setAddAddressValue(formatInputAddress(e.target.value))}/>
            <button onClick={addToken}>Add</button>
        </div>
    )

    return optionTokenContracts.length > 0 ? (
        <div className={classPrefix}>
            <MainCard classNames={`${classPrefix}-leftCard`}>
                <p className={`${classPrefix}-leftCard-title`}><Trans>Option Token held</Trans></p>
                <ul>
                    {routes}
                </ul>
                <div className={`${classPrefix}-leftCard-addToken`}>
                    {showAddButton ? addTokenView : (<button onClick={() => setShowAddButton(true)}><Trans>+ Add option Token</Trans></button>)}
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
                        <button 
                        className={'copyButton'} 
                        onClick={() => {
                            copy(optionInfo ? optionInfo.optionToken : '')
                            message.success(t`Copied`);
                        }}>
                            <CopyIcon/>
                        </button>
                    </div>
                </div>
                <div className={`${classPrefix}-rightCard-bottomInfo`}>
                    <p className={`${classPrefix}-rightCard-bottomInfo-title`}><Trans>Expected get after close</Trans></p>
                    <TokenFORTBig/>
                    <div className={`${classPrefix}-rightCard-bottomInfo-fortNum`}>
                        <div className={`${classPrefix}-rightCard-bottomInfo-fortNum-value`}>
                            {latestBlock > (optionInfo?.blockNumber || 0) ? '敬请期待' : '---'}
                            <span className={`${classPrefix}-rightCard-bottomInfo-fortNum-name`}>FORT</span>
                        </div>
                    </div>
                    <div className={`${classPrefix}-rightCard-bottomInfo-buttonDiv`}>
                        {latestBlock > (optionInfo?.blockNumber || 0) ? (<></>) : (<p><Trans>The Option Token has not reached the exercise time</Trans></p>)}
                        <MainButton disable={closeButtonDis} onClick={() => !closeButtonDis ? props.reviewCall(optionInfo!, false) : null}><Trans>Close</Trans></MainButton>
                    </div>
                    
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
