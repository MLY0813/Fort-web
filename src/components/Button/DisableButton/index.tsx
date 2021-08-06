import { FC } from 'react'
import './styles'

type Props = {
    title?: string
    className?: string
}

const DisableButton: FC<Props> = ({...props}) => {
    const disableButton = 'disableButton'
    return (
        <button className={`${disableButton}-${props.className}`}>
            {props.title}
        </button>
    )
}

export default DisableButton
