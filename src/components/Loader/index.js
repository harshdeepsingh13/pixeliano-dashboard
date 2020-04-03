import React from 'react';
import './styles.scss';
import PropTypes from 'prop-types';
import {library} from "@fortawesome/fontawesome-svg-core";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

library.add(faCircleNotch);

const Loader = ({showLoader}) => {
	return (
		<>
			{
				showLoader &&
				<div className="loader-container">
					<FontAwesomeIcon
						className={'loader'}
						icon={'circle-notch'}
						size={'2x'}
					/>
				</div>
			}
		</>
	)
};

Loader.propTypes = {
	showLoader: PropTypes
};

Loader.defaultProps = {
	showLoader: false
};

export default Loader
