import { utilService } from './util.service.js'

export const bugService = {
    query,
    getById,
    remove,
    save,
    getLabels
}
const PAGE_SIZE = 3
var bugs = utilService.readJsonFile('./data/bug.json')

function query(filterBy) {
    var filteredBugs = bugs
    if (!filterBy) return Promise.resolve(filteredBugs)

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
    }
    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
    }
    if (filterBy.labels?.length) {
        filteredBugs = filteredBugs.filter(bug => filterBy.labels.every(label => bug.labels.includes(label)))
    }

    if (filterBy.sortBy) {
        var descending = filterBy.checkbox === 'true' ? -1 : 1
        switch (filterBy.sortBy) {
            case 'createdAt':
                filteredBugs.sort((b1, b2) => (b1.createdAt - b2.createdAt) * descending)
                break
            case 'severity':
                filteredBugs.sort((b1, b2) => (b1.severity - b2.severity) * descending)
                break
            case 'title':
                filteredBugs.sort((b1, b2) => b1.title.localeCompare(b2.title) * descending)
                break
        }
    }
    const startIdx = filterBy.pageIdx * PAGE_SIZE
    filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)

    console.log(filterBy)
    return Promise.resolve(filteredBugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)

    return _saveBugsToFile()
}

function save(bugToSave) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs.splice(idx, 1, bugToSave)
    } else {
        bugToSave._id = utilService.makeId()
        bugs.push(bugToSave)
    }
    return _saveBugsToFile().then(() => bugToSave)
}

function getLabels() {
    return query().then(bugs => {
        const bugsLabels = bugs.reduce((acc, bug) => {
            return [...acc, ...bug.labels]
        }, [])
        return [...new Set(bugsLabels)]
    })
}

function _saveBugsToFile() {
    return utilService.writeJsonFile('./data/bug.json', bugs)
}
