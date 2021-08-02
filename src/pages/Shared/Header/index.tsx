import { FC } from 'react'
import './styles'

const Header: FC = () => {
    const headerNotice = 'header-notice'
    return (
        <div>
            <div className={headerNotice}>
                <b>Fort Protocol 为 Beta 版本，使用时需要自担风险，请注意不用使用过多资金</b>
            </div>
        </div>
    )
}

export default Header

