import config from '../../config/config';
import Avatar from "../Avatar";
import SocialLink from "../SociaLink";
import './styles.scss';

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

export default Header
