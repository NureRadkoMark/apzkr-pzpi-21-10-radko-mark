require('dotenv').config()
const express = require('express')
const {callback} = require("pg/lib/native/query");
const sequelize = require('./db')
const models = require('./models/models')
const PORT = process.env.PORT || 5000
const cors = require('cors')
const router = require('./routes/index')
const app = express()
const Backup = require('./controllers/backup');

app.use(cors())
app.use(express.json())
app.use('/api', router)
app.post('/backup', (req, res) => {
    Backup.performBackup(req, res);
});
app.get('/backup/download', (req, res) => {
    Backup.downloadBackup(req, res);
});

const start = async () => {
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log('Server started on port ' + PORT))
    }
    catch (e) {
        console.log(e)
    }
}
start()