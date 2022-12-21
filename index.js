const express = require('express');

require('dotenv').config();

const app = express();

const cors = require('cors');
const morgan = require('morgan');
const path = require("path");

//middlewares
app.use(morgan('dev'));
app.use(cors());

const port = process.env.PORT || 8001;


//react
if (process.env.MODE === 'production') {
	console.log("yo");
	app.use(express.static('./build'));
	app.get('/*', (req, res) => {
		res.sendFile(path.join(__dirname, './build/index.html'))
	})
}

app.listen(port, () => console.log(`Server is running on port - ${port}`));
