import React from 'react';
import './styles.scss';
import PropTypes from 'prop-types';
import Avatar from "../Avatar";
import config from '../../config/config';
import SocialLink from "../SociaLink";

const Header = props => {
	return (
		<div className="header-container">
			<Avatar/>
			<div className="about-container">
				<h2>
					Another generic photography page. Trying my hand in photography and cinematic videography. Criticism
					is always welcome.
				</h2>
			</div>
			<div className="socialLinks-container">
				{
					config.socialPlatforms.map((social, index) => (
						<SocialLink
							key={index}
							link={social.link}
							type={social.type}
						/>
					))
				}
			</div>
		</div>

	)
};

Header.propTypes = {};

export default Header
