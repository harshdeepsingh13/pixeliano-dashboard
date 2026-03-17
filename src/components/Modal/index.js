import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import * as ReactDOM from "react-dom";
import config from "../../config/config";
import './styles.scss';

const modalRoot = document.getElementById('modal-root');

const Modal = props => {
	const childContainerRef = useRef(null);
	if (!childContainerRef.current) {
		childContainerRef.current = document.createElement('div');
		childContainerRef.current.className = 'modal-container';
	}

	useEffect(
		() => {
			const childContainer = childContainerRef.current;
			modalRoot.appendChild(childContainer);
			document.getElementsByTagName('body')[0].style.overflow = 'hidden';
			return () => {
				if (modalRoot.contains(childContainer)) {
					modalRoot.removeChild(childContainer);
				}
				document.getElementsByTagName('body')[0].style.overflow = 'auto';
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
					props.onClose();
				}}
			>
				<span
					className="close-button"
				>
					<FontAwesomeIcon
						icon={faTimesCircle}
						size={'2x'}
						color={config.styleConstants.text.greyLightText}
						className="close-icon"
					/>
				</span>
				{
					props.children
				}
			</div>,
			childContainerRef.current
		)
	)
};

Modal.propTypes = {
	onClose: PropTypes.func.isRequired
};

export default React.memo(Modal)
