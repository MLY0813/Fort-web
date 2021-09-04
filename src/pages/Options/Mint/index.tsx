import { t, Trans } from '@lingui/macro'
import { BigNumber } from 'ethers'
import { FC, useCallback, useEffect, useState } from 'react'
import ChooseType from '../../../components/ChooseType'
import { PutDownIcon } from '../../../components/Icon'
import InfoShow from '../../../components/InfoShow'
import MainButton from '../../../components/MainButton'
import MainCard from '../../../components/MainCard'
import { DoubleTokenShow, SingleTokenShow } from '../../../components/TokenShow'
import { tokenList } from '../../../libs/constants/addresses'
import { ERC20Contract, NestPriceContract } from '../../../libs/hooks/useContract'
import useWeb3 from '../../../libs/hooks/useWeb3'
import { bigNumberToNormal, normalToBigNumber } from '../../../libs/utils'
import { DatePicker } from 'antd';
import '../../../styles/ant.css'
import './styles'
import moment from 'moment'
import { OptionsInfo } from '..'

type Props = {
    reviewCall: (info: OptionsInfo, isMint: boolean) => void
}

const MintOptions: FC<Props> = ({...props}) => {
    const classPrefix = 'options-mintOptions'
    const { account, chainId, library } = useWeb3()
    const fortContract = ERC20Contract(tokenList['DCU'].addresses)
    const nestPriceContract = NestPriceContract()
    const [fortNum, setFortNum] = useState('0')
    const [strikePrice, setStrikePrice] = useState('0')
    const [priceNow, setPriceNow] = useState('--.--')
    const [fortBalance, setFortBalance] = useState(BigNumber.from(0))
    const [isLong, setIsLong] = useState(false)
    const [exercise, setExercise] = useState({time: '---', blockNum: 0})

    useEffect(() => {
        if (fortContract) {
            fortContract.balanceOf(account)
            .then((value: any) => {
                setFortBalance(BigNumber.from(value))
            })
            return
        }
        setFortBalance(BigNumber.from(0))
    }, [account, fortContract])

    useEffect(() => {
        if (nestPriceContract && priceNow === '--.--' && chainId) {
            nestPriceContract
            .latestPrice(tokenList['USDT'].addresses[chainId])
            .then((value:any) => {
                setPriceNow(bigNumberToNormal(value[1], tokenList['USDT'].decimals))
            })
        }
    }, [chainId, nestPriceContract, priceNow])

    const handleType = (isLong: boolean) => {
        setIsLong(isLong)
    }

    const onOk = useCallback(
        async (value: any) => {
            const nowTime = moment().valueOf()
            const selectTime = moment(value).valueOf()
            const latestBlock = await library?.getBlockNumber()
            
            if (selectTime > nowTime) {
                const timeString = moment(value).format('YYYY[-]MM[-]DD hh:mm:ss')
                const blockNum = parseFloat(((selectTime - nowTime) / 13000).toString()).toFixed(0)
                setExercise({time:timeString, blockNum:Number(blockNum) + (latestBlock || 0)})
            } else {
                const timeString = moment().format('YYYY[-]MM[-]DD hh:mm:ss')
                setExercise({time:timeString, blockNum:latestBlock || 0})
            }
        },
        [library],
    )
        const optionInfo:OptionsInfo = {
            fortAmount: normalToBigNumber(fortNum).toString(),
            optionTokenAmount: '203',
            type: isLong,
            strikePrice: normalToBigNumber(strikePrice, tokenList['USDT'].decimals).toString(),
            exerciseTime: exercise.time,
            blockNumber: exercise.blockNum
        }
    return (
        <div className={classPrefix}>
            <MainCard classNames={`${classPrefix}-leftCard`}>
                <InfoShow topLeftText={t`Token pair`} bottomRightText={''}>
                    <DoubleTokenShow tokenNameOne={'USDT'} tokenNameTwo={'ETH'}/>
                    <button className={'select-button'}><PutDownIcon/></button>
                </InfoShow>
                <ChooseType callBack={handleType} isLong={isLong}/>
                <InfoShow topLeftText={t`Exercise time`} bottomRightText={`Block number: ${exercise.blockNum}`}>
                <DatePicker showTime onOk={onOk} bordered={false} suffixIcon={(<PutDownIcon/>)} placeholder={t`Exercise time`} allowClear={false}/>
                </InfoShow>
                
                <InfoShow topLeftText={t`Strike price`} bottomRightText={`1 ETH = ${priceNow} USDT`}>
                    <input className={'input-left'} value={strikePrice} onChange={(e) => setStrikePrice(e.target.value)}/>
                    <span>USDT</span>
                </InfoShow>
                <InfoShow topLeftText={t`Mint amount`} bottomRightText={`Balance: ${bigNumberToNormal(fortBalance)} DCU`} balanceRed={normalToBigNumber(fortNum).gt(fortBalance) ? true : false}>
                    <SingleTokenShow tokenNameOne={'DCU'} isBold/>
                    <input className={'input-middle'} value={fortNum} onChange={(e) => setFortNum(e.target.value)}/>
                    <button className={'max-button'} onClick={() => setFortNum(bigNumberToNormal(fortBalance))}>MAX</button>
                </InfoShow>
            </MainCard>

            <MainCard classNames={`${classPrefix}-rightCard`}>
                <p className={`${classPrefix}-rightCard-tokenTitle`}><Trans>Estimated number of European Options Token</Trans></p>
                <p className={`${classPrefix}-rightCard-tokenValue`}>21.7876574</p>
                <p className={`${classPrefix}-rightCard-tokenName`}>ETH-Call3000-38721293823</p>
                <MainButton onClick={() => props.reviewCall(optionInfo, true)}>BUY</MainButton>
                <div className={`${classPrefix}-rightCard-time`}>
                    <p className={`${classPrefix}-rightCard-timeTitle`}><Trans>Compare the spot price with the Srike price at</Trans></p>
                    <p className={`${classPrefix}-rightCard-timeValue`}>{exercise.time}</p>
                </div>
                
                <div className={`${classPrefix}-rightCard-smallCard`}>
                    <MainCard>
                        <div className={`${classPrefix}-rightCard-smallCard-title`}>
                            <p><Trans>{'Spot price > 1,000,000'}</Trans></p>
                            <p><Trans>Expected get</Trans></p>
                        </div>
                        <p className={`${classPrefix}-rightCard-smallCard-value`}>10,000,000,00</p>
                        <p className={`${classPrefix}-rightCard-smallCard-name`}>FORT</p>
                    </MainCard>
                    <MainCard>
                        <div className={`${classPrefix}-rightCard-smallCard-title`}>
                            <p><Trans>{'Spot price <= 1,000,000'}</Trans></p>
                            <p><Trans>Expected get</Trans></p>
                        </div>
                        <p className={`${classPrefix}-rightCard-smallCard-value`}>10,000,000,00</p>
                        <p className={`${classPrefix}-rightCard-smallCard-name`}>FORT</p>
                    </MainCard>
                </div>
            </MainCard>
        </div>
    )
}

export default MintOptions