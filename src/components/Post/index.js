import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { getCloudinaryImageUrl } from "../../services/cloudinary.service";
import Modal from "../Modal";
import './styles.scss';

const Post = ({
	              imageShortName,
	              imageProvider,
	              caption,
	              tags,
	              postId
              }) => {
	const [showPictureModal, setShowPictureModal] = useState(false);


	const getPictureUrl = useCallback(
		(quality = 100) => {
			switch (imageProvider) {
				case 'cloudinary': {
					return getCloudinaryImageUrl({
						publicId: imageShortName,
						transformations: {
							quality
						}
					});
				}
				default:
					return null;
			}
		},
		[imageProvider, imageShortName]
	);

	return (
		<div className="post-container" onClick={() => setShowPictureModal(true)}>
			{
				showPictureModal &&
				<Modal
					onClose={() => setShowPictureModal(false)}
				>
					<div className="post-container">
						<div className="image-container">
							<img src={getPictureUrl()} alt="Post" className={"image"}/>
						</div>
						<div className="caption">
							{
								caption
							}
						</div>
						<div className="tags-container">
							{
								tags.map(tag => (
									<span className="tag" key={tag.tagId}>
										{
											tag.tag.split(/\s+/).join('_').toLowerCase()
										}
									</span>
								))
							}
						</div>
					</div>

				</Modal>
			}
			<div className="image-container">
				<img src={getPictureUrl(25)} alt="Post" className="image"/>
			</div>
			<div className="caption">
				{
					caption.length > 50 ? `${caption.slice(0, 50)}...` : caption
				}
			</div>
		</div>
	)
};

Post.propTypes = {
	imageShortName: PropTypes.string.isRequired,
	imageProvider: PropTypes.string.isRequired,
	caption: PropTypes.string.isRequired,
	tags: PropTypes.array.isRequired,
	postId: PropTypes.string.isRequired,
};

export default React.memo(Post)
