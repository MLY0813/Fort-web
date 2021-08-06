import { FC } from 'react'
import './styles'

type Props = {
    title?: string,
    className?: string
}

const MainButton: FC<Props> = ({...props}) => {
    const fortButton = 'fortButton'
    return (
        <button className={`${fortButton}-${props.className}`}>
            {props.title}
        </button>
    )
}

export default MainButton
