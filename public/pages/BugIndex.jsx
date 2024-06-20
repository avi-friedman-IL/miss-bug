import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { bugService } from '../services/bug.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { utilService } from '../services/util.service.js'
import { GetPageBugs } from '../cmps/GetPageBugs.jsx'

const { useState, useEffect, useRef } = React

export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    const debouncedSetFilterBy = useRef(utilService.debounce(onSetFilterBy, 500))

    useEffect(() => {
        loadBugs()
    }, [])

    useEffect(() => {
        bugService
            .query(filterBy)
            .then(bugs => setBugs(bugs))
            .catch(err => console.log(err))
    }, [filterBy])

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function loadBugs() {
        bugService.query().then(setBugs)
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Successfully!')
                setBugs(prevBugs => prevBugs.filter(bug => bug._id !== bugId))
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            labels: [],
        }
        for (let i = 0; i < 3; i++) {
            let label = prompt('label?(critical, need-CR, dev-branch)')
            bug.labels.push(label)
        }

        bugService
            .save(bug)
            .then(savedBug => {
                console.log('Added Bug', savedBug)
                setBugs(prevBugs => [...prevBugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch(err => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService
            .save(bugToSave)
            .then(savedBug => {
                console.log('Updated Bug:', savedBug)
                setBugs(prevBugs =>
                    prevBugs.map(currBug => (currBug._id === savedBug._id ? savedBug : currBug))
                )
                showSuccessMsg('Bug updated')
            })
            .catch(err => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    return (
        <main className="main-layout">
            <h3>Bugs App</h3>
            <main>
                <BugFilter filterBy={filterBy} onSetFilterBy={debouncedSetFilterBy.current} />
                <button onClick={onAddBug}>Add Bug</button>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
                <GetPageBugs filterBy={filterBy} onSetFilterBy={onSetFilterBy}/>
            </main>
        </main>
    )
}
