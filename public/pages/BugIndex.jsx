import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { bugService } from '../services/bug.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { utilService } from '../services/util.service.js'
import { GetPageBugs } from '../cmps/GetPageBugs.jsx'
import { AddBug } from '../cmps/AddBug.jsx'

const { useState, useEffect, useRef } = React

export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const [bugId, setBugId] = useState()
    const [isOpenAddBug, setIsOpenAddBug] = useState(false)
    const [labels, setLabels] = useState([])
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    const debouncedSetFilterBy = useRef(utilService.debounce(onSetFilterBy, 500))

    useEffect(() => {
        loadLabels()
    }, [])

    useEffect(() => {
        bugService
            .query(filterBy)
            .then(bugs => setBugs(bugs))
            .catch(err => console.log(err))
    }, [filterBy,isOpenAddBug])

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

    function onAddBug() {
        setIsOpenAddBug(prev => !prev)
        setBugId(() => false)
    }
    
    function onEditBug(bugId) {
        setIsOpenAddBug(prev => !prev)
        bugService.getById(bugId).then(bug => setBugId(bug._id))
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
            <h3>Bugs App</h3>
            <main className="main-index">
                <BugFilter
                    labels={labels}
                    filterBy={filterBy}
                    onSetFilterBy={debouncedSetFilterBy.current}
                />
                <div className="bug-index-btns">
                    <button onClick={onDownloadPdf}>Download PDF</button>
                    <button className="add-bug-btn" onClick={onAddBug}>
                        Add Bug
                    </button>
                </div>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
                {isOpenAddBug && <AddBug isOpenAddBug={onAddBug} bugId={bugId ? bugId : false}/>}
                <GetPageBugs filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
            </main>
        </section>
    )
}
