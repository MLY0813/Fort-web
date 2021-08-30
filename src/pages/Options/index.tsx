import { t } from '@lingui/macro'
import classNames from 'classnames'
import { FC, useState } from 'react'
import { Link, Redirect, Route, Switch, useLocation } from 'react-router-dom'
import OptionsReview from '../Review/OptionsReview'
import CloseOptions from './Close'
import MintOptions from './Mint'
import './styles'

const Options: FC = () => {
    const [review, setReview] = useState({
        isReview: false,
        isMint: true,
    })
    const location = useLocation()
    const classPrefix = 'options'
    const routes = [
        {path: '/options/mint', content: t`Mint`},
        {path: '/options/close', content: t`Close`}
    ].map((item) => (
        <li key={item.path} className={classNames({
            selected: location.pathname.indexOf(item.path) === 0,
          })} >
            <Link to={item.path}>{item.content}</Link>
        </li>
    ))
    return review.isReview ? <OptionsReview back={() => setReview({...review, isReview:false})} isMint={review.isMint}/> : (
        <div className={classPrefix}>
            <ul className={`${classPrefix}-route`}>
                {routes}
            </ul>
            <Switch>
                <Route path="/options/mint" exact>
                    <MintOptions reviewCall={() => setReview({...review, isReview:true, isMint:true})}/>
                </Route>

                <Route path="/options/close" exact>
                    <CloseOptions reviewCall={() => setReview({...review, isReview:true, isMint:false})}/>
                </Route>

                <Redirect to="/options/mint" />
            </Switch>
        </div>
        
    )
}

export default Options