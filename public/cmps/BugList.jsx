const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug, onEditBug }) {
    return (
        <ul className="bug-list">
            {bugs.map(bug => (
                <li className="bug-preview" key={bug._id}>
                    <BugPreview bug={bug} />
                    <Link to={`/bug/${bug._id}`}>Details</Link>

                    <div>
                        <button
                            onClick={() => {
                                onEditBug(bug._id)
                            }}>
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                onRemoveBug(bug._id)
                            }}>
                            x
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    )
}
