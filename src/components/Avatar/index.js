import logo from '../../static/images/Logo.png';
import './styles.scss';

const Avatar = props => {
	return (
		<div className="avatar-container">
			<img src={logo} alt="Pixeliano" className={'avatar'}/>
		</div>
	)
};

export default Avatar
