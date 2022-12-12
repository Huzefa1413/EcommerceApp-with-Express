import express from 'express';
import path from 'path';
import cors from 'cors'

const app = express()
const port = process.env.PORT || 5001;
app.use(cors());

app.get('/weather/:cityName', (req, res) => {
    console.log("request ip: ", req.ip);
    res.send({
        city: req.params.cityName,
        temp: 30,
        humidity: 72,
        serverTime: new Date().toString()
    });
})

const __dirname = path.resolve();
app.use('/', express.static(path.join(__dirname, './web/build')))
app.use('*', express.static(path.join(__dirname, './web/build')))


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})