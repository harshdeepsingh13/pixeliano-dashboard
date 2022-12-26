const apiUrl = {
	localhost: '',
	homeLocalHostIp: '',
	herokuDev: process.env.REACT_APP_API_URL_HEROKU_DEV,
	herokuProd: process.env.REACT_APP_API_URL_HEROKU_PROD,
};
const modes = ['dev', 'herokudev', 'prod'];

const mode = process.env.REACT_APP_MODE;

export default {
	socialPlatforms: [
		{
			type: 'email',
			link: "pixeliano.hd@gmail.com"
		},
		{
			type: 'pinterest',
			link: 'https://pinterest.com/pixelianohd/'
		},
		{
			type: 'instagram',
			link: 'https://www.instagram.com/pixeliano.hd/'
		}
	],
	styleConstants: {
		mainColors: {
			primary: '#34495e',
			primaryDark: '#2c3e50',
			secondary: '#ecf0f1',
			secondaryDark: '#bdc3c7',
		},
		basicColors: {
			lightBlueGrey: '#d7f3f3',
			greyishBrown: '#424242',
			salmon: '#ff6d6d',
			dusk: '#4a5977',
			blueyGrey: '#99a1b2',
			greyishBrownTwo: '#414141',
			black: '#000000',
		},
		primaryColors: {
			primaryTealBrightest: '#17c0c3',
			primaryTealGreyedOut: '#d7f3f3',
			PrimaryTealMedium: '#45ceca',
			primaryReddish: '#fc5a5c',
			primaryYellowishDark: '#cb8c00',
			primaryYellowish: '#ffb400',
		},
		backgroundsAndBorders: {
			greyDarkBb: '#dbdbdb',
			greyMediumBb: '#ebebeb',
			greyLightBb: '#f3f3f3',
		},
		text: {
			greyDarkText: '#565555',
			greyMediumText: '#6c6e6e',
			greyLightText: '#999999',
			greyTranslucent: 'rgba(255, 255, 255, 0.075)',
		},
		otherProperties: {
			transitionTime: '0.3s',
			borderRadius: '3px'
		}
	},
	apiUrl: "/api/v1/listing/",
	status: {
		started: 'started',
		success: 'success',
		failed: 'failed',
		default: 'default',
	},
	cloudinary: {
		apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY,
		apiSecret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
		secureDeliveryURL: process.env.REACT_APP_CLOUDINARY_API_SECURE_DELIVERY_URL,
		apiURL: process.env.REACT_APP_CLOUDINARY_API_URL,
		uploadPreset: `${process.env.REACT_APP_CLOUDINARY_API_UPLOAD_PRESET}${mode}`,
	},
	getPostsLimit: +process.env.REACT_APP_CLOUDINARY_API_GET_POSTS_LIMIT
}
