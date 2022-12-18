import express from 'express';
import path from 'path';
import cors from 'cors'
import mongoose from 'mongoose';

const app = express()
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const mongodbURI = process.env.mongodbURI || "mongodb+srv://huzefa1413:murtaza1413@ecommerceapp.fxfigx3.mongodb.net/EcommerceApp";

let products = []; // TODO: connect with mongodb instead

let productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: Number,
    description: String,
    createdOn: { type: Date, default: Date.now }
});
const productModel = mongoose.model('products', productSchema);



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

    productModel.create({
        name: body.name,
        price: body.price,
        description: body.description,
    },
        (err, saved) => {
            if (!err) {
                res.send({
                    message: "Product Added Successfully",
                    added: true
                });
            } else {
                res.status(500).send({
                    message: "Server Error in Adding Products",
                    added: false
                })
            }
        })
})

app.get('/products', (req, res) => {
    productModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                message: "All Products Fetched Successfully",
                data: data
            })
        } else {
            res.status(500).send({
                message: "Server Error in Fetching Products"
            })
        }
    });
})

app.put('/product/:id', async (req, res) => {
    const body = req.body;
    const id = req.params.id;

    if (!body.name || !body.price || !body.description) {
        res.status(400).send({
            message: "Data Missing, Enter Complete Data",
            added: false
        });
        return;
    }

    try {
        let data = await productModel.findByIdAndUpdate(id,
            {
                name: body.name,
                price: body.price,
                description: body.description
            },
            { new: true }
        ).exec();
        res.send({
            message: "Product Edited Successfully",
            added: true
        });

    } catch (error) {
        res.status(500).send({
            message: "Server Error in Editing Products",
            added: false
        })
    }
})

app.delete('/product/:id', (req, res) => {
    const id = req.params.id;

    productModel.deleteOne({ _id: id }, (err, deletedData) => {
        console.log("deleted: ", deletedData);
        if (!err) {

            if (deletedData.deletedCount !== 0) {
                res.send({
                    message: "Product Deleted Successfully",
                })
            } else {
                res.status(404);
                res.send({
                    message: "No Product found with this id: " + id,
                });
            }
        } else {
            res.status(500).send({
                message: "Server Error in Deleting Products"
            })
        }
    });
})



const __dirname = path.resolve();
app.use('/', express.static(path.join(__dirname, './web/build')))
app.use('*', express.static(path.join(__dirname, './web/build')))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

/////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect(mongodbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////