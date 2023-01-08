require('dotenv/config')
const http = require('http')
const https = require('https')
const express = require('express')
const cors = require('cors')
const passport = require('passport')
const passportHttp = require('passport-http')

const app = express()

const isProd = (process.env.ENV === 'production')

const users = {
    user: 'password'
}

passport.use(new passportHttp.BasicStrategy((username, password, done) => {
    if (!users[username] || users[username] !== password) {
        return done (null, false)
    }
    return done(null, username)
}))
app.use(passport.initialize())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('nothing here');
})

app.get('/ig', (req, res) => {
    res.send('get');
})

app.post('/ig', (req, res) => {
    res.send('post');
})

app.put('/ig', (req, res) => {
    res.send('put');
})

app.delete('/ig', (req, res) => {
    res.send('delete');
})

app.post('/messages',
    passport.authenticate('basic', { session: false }),
    (req, res) => {
    console.log('creating new message from', req.body, req.user)
    const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    const message = {
      id,
      text: req.body.text,
    }
    return res.send(message)
})

if (isProd) {
    const httpsServer = https.createServer(app)
    httpsServer.listen(process.env.HTTPS_PORT || 443, () => {
        console.log(`Express HTTP serving running port ${process.env.HTTPS_PORT}!`)
    })
}
else {
    const httpServer = http.createServer(app)
    httpServer.listen(process.env.HTTP_PORT || 80, () => {
        console.log(`Express HTTP serving running port ${process.env.HTTP_PORT}!`)
    })
}