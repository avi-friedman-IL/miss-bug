const { Link, useNavigate } = ReactRouterDOM

import { userService } from '../services/user.service.js'
import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug }) {
    const user = userService.getLoggedinUser()
    const navigate = useNavigate()

    function isOwner(bug) {
        if (!user) return false
        if (!bug.owner) return true
        return user.isAdmin || bug.owner._id === user._id
    }

    return (
        <ul className="bug-list">
            {bugs.map(bug => (
                <li className="bug-preview" key={bug._id}>
                    <BugPreview bug={bug} />
                    <Link to={`/bug/${bug._id}`}>Details</Link>

                    {isOwner(bug) && (
                        <div>
                            <button onClick={() => navigate(`/bug/edit/${bug._id}`)}> Edit </button>
                            <button
                                onClick={() => {
                                    onRemoveBug(bug._id)
                                }}>
                                x
                            </button>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    )
}
