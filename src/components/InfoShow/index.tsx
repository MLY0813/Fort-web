import classNames from 'classnames'
import { FC, useEffect, useRef, useState } from 'react'
import { TokenType } from '../../libs/constants/addresses'
import './styles'

type Props = {
    topLeftText: string,
    bottomRightText: string,
    balanceRed?: boolean,
    tokenSelect?: boolean,
    timeSelect?: boolean,
    selectClick?: () => void
    tokenList?: Array<TokenType>
    getSelectedToken?: (token: string) => void
}

const InfoShow: FC<Props> = ({children, ...props}) => {
    const classPrefix = 'infoView'
    const selectRef = useRef(null)
    const [isShowSelect, setIsShowSelect] = useState(false)
    const tokenLi = props.tokenList?.map((item) => {
        const TokenIcon = item.Icon
        return (
            <li key={item.symbol} onClick={() => {
                if (props.getSelectedToken) {
                    props.getSelectedToken(item.symbol)
                }
            }}><TokenIcon/><p>{item.symbol}</p></li>
        )
    })
    const tokenSelectUl = <ul className={classNames({
        [`${classPrefix}-tokenSelect`]: true,
        [`isShow`]: isShowSelect
    })}>{tokenLi}</ul>

    useEffect(() => {
        if (isShowSelect) {
          document.addEventListener("click", clickCallback, false);
          return () => {
            document.removeEventListener("click", clickCallback, false);
          };
        }
    }, [isShowSelect]);

    function clickCallback(event: any) {
        const current: any = selectRef.current
        if (!current.contains(event.target)) {
            setIsShowSelect(false)
            return;
        }
    }

    function clickSelect(event: any) {
        if (event.target.className !== 'input-right') {
            setIsShowSelect(!isShowSelect)
        }
    }

    return (
        <div className={classPrefix}>
            <p className={`${classPrefix}-topLeft`}>{props.topLeftText}</p>
            <div className={classNames({
                [`${classPrefix}-mainView`]: true,
                [`noSelect`]: !props.tokenSelect && !props.timeSelect
            })} onClick={(e) => {clickSelect(e)}} ref={selectRef}>
                {children}
            </div>
            {props.tokenSelect ? tokenSelectUl : null}
            <p className={classNames({
                [`${classPrefix}-bottomRight`]: true,
                [`balanceRed`]: props.balanceRed
            })}>{props.bottomRightText}</p>
        </div>
    )
}

export default InfoShow
