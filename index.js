import 'dotenv/config'
import fs from 'fs'
import http from 'http'
import https from 'https'
import express from 'express'
import cors from 'cors'
import passport from 'passport'
import { BasicStrategy } from 'passport-http'

const app = express()

const users = {
    user: 'password'
}

passport.use(new BasicStrategy((username, password, done) => {
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

app.listen(process.env.HTTP_PORT, () => {
    console.log(`Express HTTP serving running port ${process.env.HTTP_PORT}!`)
})

export default app