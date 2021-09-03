import { BigNumber } from "ethers";

export const PRICE_FEE = BigNumber.from(normalToBigNumber('0.01'))
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ETHERSCAN_BASE_URL = 'https://etherscan.io/tx/'

/**
 * BigNumber转为浮点字符串
 * @param num BigNumber
 * @param decimals token精度（USDT为6位，大部分为18位）
 * @returns 浮点字符串
 */
export function bigNumberToNormal(num: BigNumber, decimals: number = 18): string {
    const str = num.toString()
    const strLength = str.length
    if (strLength > decimals) {
        return str.substr(0, strLength - decimals) + "." + str.substr(strLength - decimals, strLength)
    } else {
        var baseStr: string = "";
        for (var i = 0; i < decimals - strLength; i++) {
            baseStr += "0"
        }
        return "0." + baseStr + str
    }
}

/**
 * 字符串转为BigNumber
 * @param num 数字字符串
 * @param decimals token精度（USDT为6位，大部分为18位）
 * @returns BigNumber
 */
export function normalToBigNumber(num: string, decimals: number = 18): BigNumber {
    const pointNum = num.indexOf(".")
    var baseStr: string = ""
    var i = 0
    if (pointNum > 1) {
        throw new Error("normalToBigNumber, numString is wrong!");
    }
    if (num.indexOf(".") === 1) {
        // 有小数
        const strArray = num.split(".")
        for(i; i < decimals - strArray[1].length; i++) {
            baseStr += "0"
        }
        return BigNumber.from(strArray[0] + strArray[1] + baseStr)
    } else {
        // 没有小数
        for(i ;i < decimals; i++) {
            baseStr += "0"
        }
        return BigNumber.from(num + baseStr)
    }
}

/**
 * gasLimit默认增加
 * @param value 默认gaslImit
 * @returns 默认gaslImit增加10%
 */
export function addGasLimit(value: BigNumber): BigNumber {
    return value.mul(BigNumber.from(10000 + 1000)).div(BigNumber.from(10000))
}

/**
 * 截取省略地址字符串
 * @param address 完整地址字符串
 * @returns 省略地址字符串
 */
export function showEllipsisAddress(address: string): string {
    return address.substr(0,8) + '....' + address.substr(address.length - 6, 6)
}