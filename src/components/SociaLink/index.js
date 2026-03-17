import { faInstagram, faPinterest } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from 'prop-types';
import './styles.scss';

const iconByType = {
	email: faEnvelope,
	instagram: faInstagram,
	pinterest: faPinterest,
};

const SocialLink = ({
	                    type,
	                    link
                    }) => {
	return (
		<a className="socialLink-container" href={type === 'email' ? `mailto:${link}` : link} target={'_blank'} rel="noopener noreferrer">
			<FontAwesomeIcon
				className="icon"
				icon={iconByType[type] || faEnvelope}
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
