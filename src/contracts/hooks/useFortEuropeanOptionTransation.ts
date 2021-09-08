import { tokenList } from './../../libs/constants/addresses';
import { BigNumber } from "ethers";
import { FortEuropeanOptionContract } from "../../libs/constants/addresses";
import { FortEuropeanOption } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import useWeb3 from "../../libs/hooks/useWeb3";
import { PRICE_FEE } from "../../libs/utils";
import { t } from '@lingui/macro';
import { TransactionType } from '../../libs/hooks/useTransactionInfo';

export function useFortEuropeanOptionOpen(
    tokenName: string, 
    price: BigNumber, 
    orientation: boolean, 
    endblock: BigNumber, 
    fortAmount: BigNumber
) { 
    const { account, chainId } = useWeb3()
    const contract = FortEuropeanOption(FortEuropeanOptionContract)
    const callData = contract?.interface.encodeFunctionData('open', [
        tokenList[tokenName].addresses[chainId ? chainId : 1], 
        price, 
        orientation, 
        endblock, 
        fortAmount]
    )
    const tx = {
        from: account,
        to: contract?.address,
        data: callData,
        value: PRICE_FEE
    }
    const txPromise = useSendTransaction(contract, tx, {title:t`Option Token mint`, info:'', type: TransactionType.buyOption})
    return txPromise
}

export function useFortEuropeanOptionExercise(
    optionAddress: string,
    amount: BigNumber
) {
    const { account } = useWeb3()
    const contract = FortEuropeanOption(FortEuropeanOptionContract)
    const callData = contract?.interface.encodeFunctionData('exercise', [
        optionAddress, 
        amount]
    )
    const tx = {
        from: account,
        to: contract?.address,
        data: callData,
        value: PRICE_FEE
    }
    const txPromise = useSendTransaction(contract, tx, {title:t`Option Token close`, info:'', type: TransactionType.buyOption})
    return txPromise
}