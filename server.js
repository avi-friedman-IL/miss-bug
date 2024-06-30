import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import fs from 'fs'
import PDFDocument from 'pdfkit'

import { bugService } from './services/bug.service.js'
import { userService } from './services/user.service.js'
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
        userId: req.query.userId || '',
    }

    bugService
        .query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            console.log('err:', err)
            loggerService.error(`Couldn't get bugs...`)
            res.status(500).send(`Couldn't get bugs...`)
        })
})

app.get('/api/bug/labels', (req, res) => {
    bugService
        .getLabels()
        .then(labels => res.send(labels))
        .catch(err => {
            console.log('err:', err)
            loggerService.error(`Couldn't get labels`)
            res.status(500).send(`Couldn't get labels`)
        })
})

app.get('/api/bug/download', (req, res) => {
    const doc = new PDFDocument()
    doc.pipe(fs.createWriteStream('bugs.pdf'))
    doc.fontSize(25).text('BUGS LIST').fontSize(16)

    bugService.query().then(bugs => {
        bugs.forEach(bug => {
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
            console.log('err:', err)
            loggerService.error(`Couldn't get bug (${id})`, err)
            res.status(500).send(`Couldn't get bug (${id})`, err)
        })
})

app.delete('/api/bug/:id', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot remove bug')
    const { id } = req.params

    bugService
        .remove(id, loggedinUser)
        .then(() => res.send(`Bug ${id} deleted...`))
        .catch(err => {
            console.log('err:', err)
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug', err)
        })
})

app.post('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const { title, description, severity, createdAt, labels, owner } = req.body
    const bugToSave = {
        title: title || '',
        description: description || '',
        severity: +severity || 0,
        createdAt: +createdAt || Date.now(),
        labels: labels || [],
        owner: owner || {},
    }

    bugService
        .save(bugToSave, loggedinUser)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            console.log('err:', err)
            res.status(401).send('Cannot add bug')
        })
})

app.put('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug')

    const { _id, title, description, severity, createdAt, labels, owner } = req.body
    const bugToSave = {
        _id,
        title: title || '',
        description: description || '',
        severity: +severity || 0,
        createdAt: +createdAt || Date.now(),
        labels: labels || [],
        owner: owner || {},
    }

    bugService
        .save(bugToSave, loggedinUser)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            console.log('err:', err)
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

app.get('/api/user', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // console.log('loggedinUser:', loggedinUser)
    // if(!loggedinUser?.isAdmin) return res.status(501).send('Cannot load users!')
    
    userService
        .query()
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            console.log('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService
        .getById(userId)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            console.log('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials).then(user => {
        if (user) {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        } else {
            res.status(401).send('Invalid Credentials')
        }
    })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials).then(user => {
        if (user) {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        } else {
            res.status(400).send('Cannot signup')
        }
    })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () => loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`))
