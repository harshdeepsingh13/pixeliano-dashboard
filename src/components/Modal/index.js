import React, {useEffect} from 'react';
import './styles.scss';
import PropTypes from 'prop-types';
import * as ReactDOM from "react-dom";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faTimesCircle} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import config from "../../config/config";

library.add(faTimesCircle);

const root = document.getElementById('root');
const modalRoot = document.getElementById('modal-root');

const Modal = props => {

	const childContainer = document.createElement('div');
	childContainer.className = 'modal-container';

	const close = () => {
		modalRoot.childNodes[0] && modalRoot.removeChild(childContainer);
		document.getElementsByTagName('body')[0].style.overflow = 'auto';
	}

	useEffect(
		() => {
			modalRoot.appendChild(childContainer);
			console.log('dom', document.getElementsByTagName('body'))
			document.getElementsByTagName('body')[0].style.overflow = 'hidden';
			return () => {
				console.log('destructor');
				close()
			}
		},
		[]
	);

	return (
		ReactDOM.createPortal(
			<div
				className="modal"
				onClick={(e) => {
					e.stopPropagation();
					console.log('click', props.onClose);
					props.onClose();
					// close();
				}}
			>
				<span
					className="close-button"
				>
					<FontAwesomeIcon
						icon={['far', 'times-circle']}
						size={'2x'}
						color={config.styleConstants.text.greyLightText}
						className="close-icon"
					/>
				</span>
				{
					props.children
				}
			</div>,
			childContainer
		)
	)
};

Modal.propTypes = {
	onClose: PropTypes.func.isRequired
};

export default React.memo(Modal)
