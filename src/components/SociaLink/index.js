import React from 'react';
import './styles.scss';
import PropTypes from 'prop-types';
import {library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {faInstagram, faPinterest} from "@fortawesome/free-brands-svg-icons";
import config from '../../config/config';

library.add(faEnvelope, faInstagram, faPinterest);

const SocialLink = ({
	                    type,
	                    link
                    }) => {
	return (
		<a className="socialLink-container" href={type === 'email' ? `mailto:${link}` : link} target={'_blank'}>
			<FontAwesomeIcon
				className="icon"
				icon={type === 'email' ? 'envelope' : ['fab', type]}
				size={"2x"}
			/>
		</a>
	)
};

SocialLink.propTypes = {
	type: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired
};

export default SocialLink
