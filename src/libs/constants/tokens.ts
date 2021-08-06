import { TokenETH, TokenUSDT } from "../../components/Icon"

export type AddressesType = {
    [key: number]: string
}

type TokenType = {
    symbol: string
    Icon: typeof TokenETH
    decimals: number
    addresses: AddressesType
}

export const tokenList: {[key: string]: TokenType} = {
    "ETH": {
        symbol: 'ETH',
        Icon: TokenETH,
        decimals: 18,
        addresses: {
            1: '0x0',
            2: '',
            4: '0x0'
        }
    },
    "USDT": {
        symbol: 'NEST',
        Icon: TokenUSDT,
        decimals: 18,
        addresses: {
            1: '0x04abeda201850ac0124161f037efd70c74ddc74c',
            2: '',
            4: '0x8d6b97c482ecc00d83979dac4a703dbff04fd84f'
        }
    },
}

