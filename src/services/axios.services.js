import axios from 'axios';
import config from '../config/config';

export const getPosts = (offset) =>
	axios(
		{
			method: "GET",
			url: `${config.apiUrl}posts/${offset}`
		}
	);
