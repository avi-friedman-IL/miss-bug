const { useState, useEffect, useRef } = React
const { Link, useNavigate } = ReactRouterDOM

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { bugService } from '../services/bug.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { utilService } from '../services/util.service.js'
import { GetPageBugs } from '../cmps/GetPageBugs.jsx'
import { BugEdit } from './BugEdit.jsx'

export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const [labels, setLabels] = useState([])
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    const debouncedSetFilterBy = useRef(utilService.debounce(onSetFilterBy, 500))

    const navigate = useNavigate()

    useEffect(() => {
        loadLabels()
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

    function loadLabels() {
        bugService
            .getLabels()
            .then(labels => setLabels(labels))
            .catch(err => {
                console.log(err)
                showErrorMsg('Cannot get labels')
            })
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

    function onDownloadPdf() {
        bugService
            .downloadPdf()
            .then(() => {
                console.log('PDF DOWNLOAD')
                showSuccessMsg('Download pdf successfully')
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot download pdf')
            })
    }

    return (
        <section className="bug-index">
            <main className="main-index">
                <BugFilter labels={labels} filterBy={filterBy} onSetFilterBy={debouncedSetFilterBy.current} />
                <div className="bug-index-btns">
                    <button onClick={onDownloadPdf}>Download PDF</button>
                    <Link to="/bug/edit">
                        <button className="add-bug-btn">Add bug</button>
                    </Link>
                </div>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} />
                <GetPageBugs filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
            </main>
        </section>
    )
}
