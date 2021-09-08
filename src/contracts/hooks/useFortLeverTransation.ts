import { tokenList } from './../../libs/constants/addresses';
import { t } from "@lingui/macro";
import { BigNumber } from "ethers";
import { FortLeverContract } from "../../libs/constants/addresses";
import { FortLever } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import useWeb3 from "../../libs/hooks/useWeb3";
import { PRICE_FEE } from "../../libs/utils";
import { TransactionType } from '../../libs/hooks/useTransactionInfo';

export function useFortLeverBuy(
    tokenName: string, 
    lever: BigNumber, 
    orientation: boolean, 
    fortAmount: BigNumber
) {
    const { account, chainId } = useWeb3()
    const contract = FortLever(FortLeverContract)
    if (!chainId) {
        throw Error('useFortLeverBuy: !chainId')
    }
    const callData = contract?.interface.encodeFunctionData('buy', [
        tokenList[tokenName].addresses[chainId], 
        lever, 
        orientation, 
        fortAmount]
    )
    const tx = {
        from: account,
        to: contract?.address,
        data: callData,
        value: PRICE_FEE
    }
    const txPromise = useSendTransaction(contract, tx, {title:t`Buy Leveraged Token`, info:'', type: TransactionType.buyLever})
    return txPromise
}

export function useFortLeverSell(
    leverAddress: string, 
    amount: string
) {
    const { account } = useWeb3()
    const contract = FortLever(FortLeverContract)
    const callData = contract?.interface.encodeFunctionData('buy', [
        leverAddress, 
        amount]
    )
    const tx = {
        from: account,
        to: contract?.address,
        data: callData,
        value: PRICE_FEE
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const txPromise = useSendTransaction(contract, tx, {title:t`Sell Leveraged Token`, info:'', type: TransactionType.closeLever})
    return txPromise
}

