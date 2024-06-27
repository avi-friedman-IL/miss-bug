const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { loggerService } from '../../services/logger.service.js'
import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'


export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        bugService.getById(bugId)
            .then(bug => {
                setBug(bug)
            })
            .catch(err => {
                showErrorMsg('Cannot load bug')
            })
    }, [])

    if (!bug) return <h1>loadings....</h1>
    return <section className="bug-details">
        <h3>Bug Details 🐛</h3>
        <h3>name: {bug.owner.fullName}</h3>
        <h4>title: {bug.title}</h4>
        <p>description: {bug.description}</p>
        <p>Severity: <span>{bug.severity}</span></p>
        <p>labels: {bug.labels.join(', ')}</p>
        <Link to="/bug">Back to List</Link>
    </section>

}

