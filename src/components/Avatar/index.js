import React from 'react';
import './styles.scss';
import PropTypes from 'prop-types';
import logo from '../../static/images/Logo.png';

const Avatar = props => {
	return (
		<div className="avatar-container">
			<img src={logo} alt="Pixeliano" className={'avatar'}/>
		</div>
	)
};

Avatar.propTypes = {};

export default Avatar
