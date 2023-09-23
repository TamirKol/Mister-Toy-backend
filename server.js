import express from 'express'
import { toyService } from './services/toy.service.js'
import cors from 'cors'
import { loggerService } from './services/logger.service.js';
import cookieParser from 'cookie-parser'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express()

// App Configuration
const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
    ],
    credentials: true
}

app.use(cors(corsOptions))
app.use(cookieParser()) // for res.cookies
app.use(express.json()) // for req.body
app.use(express.static('public'))


//List
app.get('/api/toy', (req, res) => {
    // const {filterBy = {}, sort = {}} = req.query.params
    // console.log("req.query.params:", req.query.params)
const {txt,inStock,labels}=req.query
const filterBy={txt,inStock,labels}
    toyService.query(filterBy)
        .then(toys => {
            res.send(toys)
        })
        .catch(err => {
            console.log('Had issues getting toys', err);
            res.status(400).send({ msg: 'Had issues getting toys' })
        })
})

// Read - getById
app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.get(toyId)
        .then(toy => {
            // toy.msgs =['HEllo']
            res.send(toy)
        })
        .catch(err => {
            loggerService.error('Cannot get toy', err)
            res.status(400).send(err)
        })
})

// Remove
app.delete('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.remove(toyId)
        .then(msg => {
            res.send({ msg, toyId })
        })
        .catch(err => {
            loggerService.error('Cannot delete toy', err)
            res.status(400).send('Cannot delete toy, ' + err)
        })
})

// Add
app.post('/api/toy', (req, res) => {
    const { name, inStock, price,labels } = req.body

    const toy = {
        name,
        inStock,
        labels,
        price: +price
    }
    toyService.save(toy)
        .then(savedToy => {
            res.send(savedToy)
        })
        .catch(err => {
            loggerService.error('Cannot add toy', err)
            res.status(400).send('Cannot add toy')
        })
})

// Edit
app.put('/api/toy', (req, res) => {
    const { name, inStock, price,labels, _id } = req.body
    const toy = {
        _id,
        name,
        inStock,
        labels,
        price:+price
    }
    toyService.save(toy)
        .then((savedToy) => {
            res.send(savedToy)
        })
        .catch(err => {
            loggerService.error('Cannot update toy', err)
            res.status(400).send('Cannot update toy')
        })

})

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const PORT = 3030
app.listen(PORT, () => console.log(`Server ready at port ${PORT}! http://localhost:${PORT}`))
