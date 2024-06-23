import express from 'express'
import cookieParser from 'cookie-parser'
import fs from 'fs'
import PDFDocument from 'pdfkit'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
        pageIdx: +req.query.pageIdx || 0,
        sortBy: req.query.sortBy || '',
        labels: req.query.labels || [],
        checkbox: req.query.checkbox || '',
    }

    bugService
        .query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error(`Couldn't get bugs...`)
            res.status(500).send(`Couldn't get bugs...`)
        })
})

app.get('/api/bug/labels', (req, res) => {
    bugService
        .getLabels()
        .then(labels => res.send(labels))
        .catch(err => {
            loggerService.error(`Couldn't get labels`, err)
            res.status(500).send(`Couldn't get labels`)
        })
})

app.get('/api/bug/download', (req, res) => {
    const doc = new PDFDocument()
    doc.pipe(fs.createWriteStream('bugs.pdf'))
    doc.fontSize(25).text('BUGS LIST').fontSize(16)

    bugService.query()
        .then((bugs) => {
            bugs.forEach((bug) => {
                const bugTxt = `${bug.title}: ${bug.description}. (severity: ${bug.severity})`
                doc.text(bugTxt)
            })

            doc.end()
            res.end()
        })
})


app.get('/api/bug/:id', (req, res) => {
    const { id } = req.params

    var visitedBugs = req.cookies.visitedBugs || []
    if (visitedBugs.length >= 3) return res.status(401).send('You cannot access the bug, wait!')
    if (!visitedBugs.includes(id)) visitedBugs.push(id)
    res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })

    bugService
        .getById(id)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(`Couldn't get bug (${id})`, err)
            res.status(500).send(`Couldn't get bug (${id})`)
        })
})

app.delete('/api/bug/:id', (req, res) => {
    const { id } = req.params

    bugService.remove(id).then(() => res.send(`Bug ${id} deleted...`))
})

app.put('/api/bug', (req, res) => {
    const { _id, title, description, severity, createdAt, labels } = req.body
    const bugToSave = {
        _id,
        title: title || '',
        description: description || '',
        severity: +severity || 0,
        createdAt: +createdAt || Date.now(),
        labels: labels || [],
    }

    bugService.save(bugToSave).then(savedBug => res.send(savedBug))
})

app.post('/api/bug', (req, res) => {
    const { title, description, severity, createdAt, labels } = req.body
    const bugToSave = {
        title: title || '',
        description: description || '',
        severity: +severity || 0,
        createdAt: +createdAt || Date.now(),
        labels: labels || [],
    }

    bugService.save(bugToSave).then(savedBug => res.send(savedBug))
})

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
