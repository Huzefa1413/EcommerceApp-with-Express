import express from 'express';
import path from 'path';
import cors from 'cors'

const app = express()
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

let products = []; //Add mongodb here

app.post('/product', (req, res) => {
    const body = req.body;

    if (!body.name || !body.price || !body.description) {
        res.status(400).send({
            message: "Data Missing, Enter Complete Data",
            added: false
        }
        );
        return;
    }

    products.push({
        id: `${new Date().getTime()}`,
        name: body.name,
        price: body.price,
        description: body.description
    });
    res.send({
        message: "Product Added Successfully",
        added: true
    });
})

app.get('/products', (req, res) => {
    res.send({
        message: "All Products Fetched Successfully",
        data: products
    });
})

app.get('/product/:id', (req, res) => {
    const id = req.params.id;
    let isFound = false;

    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            res.send({
                message: "Product Fetched Successfully",
                data: products[i]
            });
            isFound = true;
            break;
        }
    }

    if (!isFound) {
        res.status(404);
        res.send({
            message: "Product Not Found"
        });
    }
})

app.put('/product/:id', (req, res) => {
    const data = req.body;
    const id = req.params.id;
    let isFound = false;

    if (!data.name && !data.price && !data.description) {
        res.status(400).send({
            message: "Data Missing, Enter Complete Data"
        });
        return;
    }
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            products[i].name = data.name;
            products[i].price = data.price;
            products[i].description = data.description;
            res.send({
                message: "Product Edited Successfully",
                added: true
            });
            isFound = true;
            break;
        }
    }

    if (!isFound) {
        res.status(404);
        res.send({
            message: "Product Not Found"
        });
    }
})

app.delete('/product/:id', (req, res) => {
    const id = req.params.id;
    let isFound = false;

    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            products.splice(i, 1);
            res.send({
                message: "Product Deleted Successfully",
            });
            isFound = true;
            break;
        }
    }

    if (!isFound) {
        res.status(404);
        res.send({
            message: "Product Not Found"
        });
    }
})

const __dirname = path.resolve();
app.use('/', express.static(path.join(__dirname, './web/build')))
app.use('*', express.static(path.join(__dirname, './web/build')))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})