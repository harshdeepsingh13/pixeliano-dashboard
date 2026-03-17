import config from '../config/config';

const transformationsMapping = {
	width: 'w',
	height: 'h',
	quality: 'q',
};

export const getCloudinaryImageUrl = ({
	                                      publicId,
	                                      transformations,
                                      }) => {
	/*
	transformations ----
	width
	height
	quality
	* */
	if (transformations && Object.keys(transformations).length !== 0) {
		const transformationArray = [];
		for (let [key, value] of Object.entries(transformations)) {
			transformationArray.push(`${transformationsMapping[key]}_${value}`);
		}
		return `${config.cloudinary.secureDeliveryURL}${transformationArray.join(',')}/${publicId}`;
	} else {
		return `${config.cloudinary.secureDeliveryURL}${publicId}`;
	}
};
