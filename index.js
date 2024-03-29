const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//dotenv
require('dotenv').config();

const {logger} = require('./config/config');
const v1Routes = require('./api/v1');
const errorMiddleware = require('./middlewares/errorMiddleware');
const requestCallMiddleware = require('./middlewares/requestCallMiddleware');

const app = express();
const port = process.env.PORT || 8080;

//middlewares
app.use(require('morgan')('dev'));
app.use(require('cors')());
app.use(requestCallMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//mongodb connection
require('./config/mongoose')();

//API routes
const apiRoutes = express.Router();
app.use('/api', apiRoutes);
v1Routes(apiRoutes);

console.log("yo1", process.env.MODE)

//react
if (process.env.MODE === 'production') {
	console.log("yo");
	app.use(express.static('./build'));
	app.get('/*', (req, res) => {
		res.sendFile(path.join(__dirname, './build/index.html'))
	})
}

//error handler
app.use(errorMiddleware);



app.listen(port, () => logger.info(`Server is running on port - ${port}`));
