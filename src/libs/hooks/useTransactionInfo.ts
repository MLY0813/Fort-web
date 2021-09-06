import { Contract } from 'ethers';
import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";
import useWeb3 from "./useWeb3";
import { TransactionModalTokenInfo, TransactionModalType } from "../../pages/Shared/TransactionModal";
import { notifyTransaction } from "../../pages/Shared/TransactionToast";
import ERC20ABI from '../../contracts/abis/ERC20.json'

export enum TransactionState {
    Pending = 0,
    Success = 1,
    Fail = 2,
    Revert = 3
}

export type TransactionBaseInfoType = {
    title: string,
    info: string
}

export type TransactionInfoType = {
    title: string,
    info: string,
    hash: string,
    txState: TransactionState,
    addTime: number,
    endTime: number
}

type ShoeModalType = {
    isShow: boolean,
    hash: string,
    txType: TransactionModalType,
    tokenInfo?: TransactionModalTokenInfo
}

const useTransactionList = () => {
    const {chainId, library} = useWeb3()
    const [txList, setTxList] = useState<TransactionInfoType[]>([])
    const [showModal, setShowModal] = useState<ShoeModalType>({isShow:false, hash:'0x0', txType:TransactionModalType.wait})
    const [pendingList, setPendingList] = useState<TransactionInfoType[]>([])
    const [checking, setChecking] = useState(false)

    useEffect(() => {
        if (!chainId) {return}
        ;(async () => {
            var cache = localStorage.getItem("transactionList" + chainId?.toString())
            if (!cache) {return []}
            setTxList(JSON.parse(cache))
            console.log('1' + {cache})
        })()
    }, [chainId])
    
    useEffect(() => {
        if (txList.length === 0) {return}
        ;(async () => {
            localStorage.setItem('transactionList' + chainId?.toString(), JSON.stringify(txList))
            // 过滤pending交易
            var noResultTx: Array<TransactionInfoType> = txList.filter((item) => {return item.txState === TransactionState.Pending})
            setPendingList(noResultTx)
            console.log('2' + {txList})
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [txList])

    useEffect(() => {
        if (pendingList.length === 0 || checking) {return}
        setChecking(true)
        ;(async () => {
            console.log('3' + {pendingList})
            for (let index = 0; index < pendingList.length; index++) {
                const element = pendingList[index];
                const rec = await library?.getTransactionReceipt(element.hash)
                if (typeof rec?.status !== 'undefined') {
                    const status = rec.status ? TransactionState.Success : TransactionState.Fail
                    element.txState = status
                    updateList(element)
                    setChecking(false)
                    console.log('成功' + {index})
                    notifyTransaction(element)
                    // if (element.hash === showModal.hash) {
                    //     setShowModal({isShow:true, hash: element.hash, txState:TransactionState.Success})
                    // }
                    if (element.title === '购买期权') {
                        var cache = localStorage.getItem("optionTokensList" + chainId?.toString())
                        var optionTokenList = []
                        if (cache) {
                            optionTokenList = JSON.parse(cache)
                        }
                        const newTokenAddress = rec['logs'][1]['address']
                        console.log(rec['logs'][1]['address'])
                        const newTokenContract = new Contract(newTokenAddress, ERC20ABI, library)
                        const newTokenName = await newTokenContract.name()
                        const optionToken = {address: newTokenAddress, name: newTokenName}
                        console.log(rec)
                        localStorage.setItem('optionTokensList' + chainId?.toString(), JSON.stringify([...optionTokenList, optionToken]))
                        const tokenInfo:TransactionModalTokenInfo = {
                            tokenName: newTokenName,
                            tokenAddress: newTokenAddress,
                            tokenValue: '3333333'
                        }
                        setShowModal({isShow:true, hash: element.hash, txType:TransactionModalType.eurSuccess, tokenInfo:tokenInfo})
                    }
                    
                    return
                }
                console.log('下一个' + {index})
            }
            setTimeout(() => {
                setChecking(false)
            }, 15000)
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingList, checking, library])

    const pushTx = (hash: string, txInfo:TransactionBaseInfoType) => {
        const nowDate = parseInt((new Date().getTime() / 1000).toString())
        const monthDate = nowDate + 86400 * 30
        const newTxInfo: TransactionInfoType = {
            title: txInfo.title,
            info: txInfo.info,
            hash: hash,
            txState: TransactionState.Pending,
            addTime: nowDate,
            endTime: monthDate
        }
        updateList(newTxInfo)
    }

    const updateList = (item:TransactionInfoType) => {
        const index = txList.findIndex((t) => t.hash === item.hash)
        if (index > -1) {
            txList[index] = item
            setTxList([...txList])
        } else {
            setTxList(txList.concat(item))
        }
    }

    const closeModal = () => {
        setShowModal({isShow:false, hash:'0x0', txType:TransactionModalType.wait})
    }

    return {txList, showModal, setShowModal, pushTx, closeModal, pendingList}
}



const transactionList = createContainer(useTransactionList)

const useTransactionListCon = () => {
    return transactionList.useContainer()
}

export const Provider = transactionList.Provider
  
export default useTransactionListCon