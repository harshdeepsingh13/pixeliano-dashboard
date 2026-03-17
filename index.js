const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

//dotenv
require('dotenv').config();

const {logger} = require('./config/config');
const v1Routes = require('./api/v1');
const errorMiddleware = require('./middlewares/errorMiddleware');
const requestCallMiddleware = require('./middlewares/requestCallMiddleware');

const app = express();
const port = process.env.PORT || 8080;
const allowedAPIMethods = new Set(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin) {
			return callback(null, true);
		}

		if (process.env.MODE !== 'production') {
			return callback(null, true);
		}

		if (process.env.CORS_ORIGIN && origin === process.env.CORS_ORIGIN) {
			return callback(null, true);
		}

		const corsError = new Error('Origin not allowed by CORS');
		corsError.status = 403;
		return callback(corsError);
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
};

//middlewares
app.disable('x-powered-by');
app.use(require('morgan')('dev'));
app.use(cors(corsOptions));
app.use(requestCallMiddleware);
app.use(bodyParser.json({limit: '10kb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '10kb'}));

//mongodb connection
require('./config/mongoose')();

//API routes
const apiRoutes = express.Router();
app.use('/api', (req, res, next) => {
	if (!allowedAPIMethods.has(req.method)) {
		return res.status(405).json({
			status: 405,
			message: 'Method Not Allowed',
		});
	}

	return next();
});
app.use('/api', apiRoutes);
v1Routes(apiRoutes);

app.use('/api', (req, res) => {
	return res.status(404).json({
		status: 404,
		message: 'Not Found',
	});
});

//react
if (process.env.MODE === 'production') {
	app.use(express.static(path.join(__dirname, './build'), {
		dotfiles: 'ignore',
		index: false,
		redirect: false,
	}));
	app.get('*', (req, res, next) => {
		if (req.path.startsWith('/api/')) {
			return next();
		}

		return res.sendFile(path.join(__dirname, './build/index.html'));
	})
}

//error handler
app.use(errorMiddleware);



app.listen(port, () => logger.info(`Server is running on port - ${port}`));
