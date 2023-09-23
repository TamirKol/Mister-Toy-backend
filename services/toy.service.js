import fs from 'fs'
import { utilService } from '../services/util.service.js'

const gToys = utilService.readJsonFile('data/toys.json')

export const toyService = {
    query,
    get,
    remove,
    save
}

function query(filterBy) {
    console.log('my filter',filterBy);

    if (!filterBy) return Promise.resolve(gToys)

    let toyToDisplay = gToys

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        toyToDisplay = toyToDisplay.filter(toy => regExp.test(toy.name))
    }
    if (filterBy.inStock) {
        if (filterBy.inStock === "false") {
            toyToDisplay = toyToDisplay.filter(toy => toy.inStock === false)
        } else {
            toyToDisplay = toyToDisplay.filter(toy => toy.inStock === true)
        }
    }
    if (filterBy.labels && filterBy.labels.length > 0) {
        toyToDisplay = toyToDisplay.filter(toy => {
            return toy.labels.some(label => filterBy.labels.includes(label))
        })
    }

    return Promise.resolve(toyToDisplay) 

}

function get(toyId) {
    const toy = gToys.find(toy => toy._id === toyId)
    if (!toy) return Promise.reject('Toy not found!')
    return Promise.resolve(toy)
}


function remove(toyId) {
    const idx = gToys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such Toy')
    const toy = gToys[idx]
    gToys.splice(idx, 1)
    return _saveToysToFile()

}

// function save(toy) {
//     if (toy._id) {
//         const toyToUpdate = gToys.find(currToy => currToy._id === toy._id)
//         toyToUpdate.name = toy.name
//         toyToUpdate.inStock = toy.inStock
//         toyToUpdate.price = toy.price
//         toyToUpdate.labels = toy.labels
//     } else {
//         toy._id = utilService._makeId()
//         gToys.push(toy)
//     }

//     return _saveToysToFile().then(() => toy)
//     // return Promise.resolve(toy)
// }

function save(toy) {
    if (toy._id) {
        const idx = gToys.findIndex(currToy => currToy._id === toy._id)
        gToys[idx] = { ...gToys[idx], ...toy }
    } else {
        toy.createdAt = Date.now();
        toy._id = _makeId();
        gToys.unshift(toy);
    }
    _saveToysToFile();
    return Promise.resolve(toy);
}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {

        const toysStr = JSON.stringify(gToys, null, 4)
        fs.writeFile('data/toys.json', toysStr, (err) => {
            if (err) {
                return console.log(err);
            }
            console.log('The file was saved!');
            resolve()
        });
    })
}

function _makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}


