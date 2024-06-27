const {Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useState } = React

import { showErrorMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { LoginSignup } from './LoginSignup.jsx'
import { UserMsg } from './UserMsg.jsx'

export function AppHeader() {
    const [user, setUser] = useState(userService.getLoggedinUser())

    const navigate = useNavigate()

    function onLogout() {
        userService
            .logout()
            .then(() => {
                onSetUser(null)
            })
            .catch(err => {
                showErrorMsg('OOPs try again')
            })
    }

    function onSetUser(user) {
        setUser(user)
        // navigate('/')
    }
    console.log('user:', user)
    return (
        <header className="main-layout">
            <section className="header-container">
                <UserMsg />
                <h1>Bugs are Forever</h1>
                <nav>
                    <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
                    <NavLink to="/about">About</NavLink>
                </nav>
            </section>
            {user ? (
                <section>
                    <button onClick={onLogout}>Logout</button>
                    <Link to={`/user/${user._id}`}>{`Hello ${user.fullName}`}</Link>
                </section>
            ) : (
                <section>
                    <LoginSignup onSetUser={onSetUser} />
                </section>
            )}
        </header>
    )
}
