import { FC } from 'react'
import { ProblemIcon } from '../Icon'
import { Popover } from 'antd';
import './styles'

type Props = {
    leftText: string,
    rightText: string
}

const LineShowInfo: FC<Props> = ({...props}) => {
    const classPrefix = 'lineShowInfo'
    return (
        <div className={classPrefix}>
            <p className={`${classPrefix}-leftText`}>{props.leftText}</p>
            <p className={`${classPrefix}-rightText`}>{props.rightText}</p>
        </div>
    )
}

export const LineShowInfoForOracleFee: FC<Props> = ({...props}) => {
    const classPrefix = 'lineShowInfo'
    const content = (
        <div className={`${classPrefix}-content`}>
            <h4>预言机调用费</h4>
            <p>您需要向 NEST 协议支付预言机价格使用费，以便为智能合约提供准确的市场价格数据。</p>
        </div>
    )
    return (
        <div className={classPrefix}>
            <p className={`${classPrefix}-leftText`}>
                {props.leftText}
                <Popover placement="rightTop" title={''} content={content} trigger="hover" arrowPointAtCenter>
                    <button><ProblemIcon/></button>
                </Popover>
                </p>
            <p className={`${classPrefix}-rightText`}>{props.rightText}</p>
        </div>
    )
}

export default LineShowInfo
