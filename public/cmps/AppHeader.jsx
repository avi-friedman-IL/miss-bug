const { NavLink } = ReactRouterDOM
const { useEffect } = React

import { UserMsg } from './UserMsg.jsx'

export function AppHeader() {
    useEffect(() => {
        // component did mount when dependancy array is empty
    }, [])

    return (
        <header className="main-layout">
            <div className="header-container">
                <UserMsg />
                <h1>Bugs are Forever</h1>
                <nav>
                    <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
                    <NavLink to="/about">About</NavLink>
                </nav>
            </div>
        </header>
    )
}
