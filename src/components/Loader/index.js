import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from 'prop-types';
import './styles.scss';

const Loader = ({showLoader}) => {
	return (
		<>
			{
				showLoader &&
				<div className="loader-container">
					<FontAwesomeIcon
						className={'loader'}
						icon={faCircleNotch}
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
