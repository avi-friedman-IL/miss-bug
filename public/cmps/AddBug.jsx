const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouter

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { bugService } from '../services/bug.service.js'

export function AddBug({ isOpenAddBug, bugId }) {
    const [bug, setBug] = useState({})
    const params = useParams()

    useEffect(() => {
        if (bugId) bugService.getById(bugId).then(bug => setBug(bug))
        else setBug(bugService.getEmptyBug())
    }, [bugId])

    function onSaveBug(ev) {
        ev.preventDefault()
        bugService
            .save(bug)
            .then(savedBug => {
                console.log('Added Bug', savedBug)
                showSuccessMsg(bugId ? 'Bug edit!' : 'Bug added!')
            })
            .catch(err => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
        isOpenAddBug()
    }

    function handleChange({ target }) {
        let name = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break
            case 'checkbox':
                value = target.checked
                break
            default:
                break
        }

        setBug(prevBug => ({ ...prevBug, [name]: value }))
    }

    function handleLabelChange({ target }) {
        const name = target.name
        let value = target.value
        setBug(prevBug => ({ ...prevBug, [name]: value.split(',') }))
    }

    // if (!bug) return
    const { title, severity, labels } = bug
    return (
        <section className="add-bug">
            <form action="" onSubmit={onSaveBug}>
                <input
                    onChange={handleChange}
                    type="text"
                    name="title"
                    value={title}
                    placeholder="title"
                />
                <input
                    onChange={handleChange}
                    type="number"
                    name="severity"
                    value={severity}
                    placeholder="severity"
                />
                <input
                    onChange={handleLabelChange}
                    type="text"
                    name="labels"
                    value={labels}
                    placeholder="labels"
                />

                <button className="save-bug">save</button>
            </form>
        </section>
    )
}
