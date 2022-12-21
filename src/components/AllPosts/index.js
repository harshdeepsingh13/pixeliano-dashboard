import React, {useEffect, useState, useCallback} from 'react';
import './styles.scss';
import PropTypes from 'prop-types';
import config from '../../config/config';
import {getPosts as getPostsService} from '../../services/axios.services';
import Post from "../Post";
import Loader from "../Loader";

const AllPosts = props => {

	const [posts, setPosts] = useState([]);
	const [totalPostsCount, setTotalPostsCount] = useState(posts.length);
	const [postsOffset, setPostsOffset] = useState(0);
	const [getPostsStatus, setGetPostsStatus] = useState({
		status: config.status.default,
		message: ''
	});

	const getCount = () => {
		const countObject = {};
		if (posts.length) {
			posts.forEach(post => {
				if (countObject[post.postId]) {
					countObject[post.postId] = countObject[post.postId] + 1;
				} else {
					countObject[post.postId] = 1;
				}
			})
		}
		return countObject
	};

	const getPosts = useCallback(
		() => {
			(async () => {
				try {
					setGetPostsStatus({...getPostsStatus, status: config.status.started});
					const {data: {data}} = await getPostsService(postsOffset);
					if (postsOffset === 0 || totalPostsCount !== data.totalPosts) {
						setTotalPostsCount(data.totalPosts);
					}
					setPosts((prevPosts) => [...prevPosts, ...data.posts]);
					setGetPostsStatus({...getPostsStatus, status: config.status.success});
				} catch (e) {
					setGetPostsStatus({...getPostsStatus, status: config.status.failed});
					console.log('error', e);
				}
			})()
		},
		[postsOffset, setPosts, setTotalPostsCount, setGetPostsStatus]
	);

	const handleLoadMorePosts = useCallback(
		() => {
			const {
				scrollHeight,
				clientHeight,
				scrollTop
			} = document.documentElement;

			/*console.log('scrollHeight', scrollHeight, 'clientHeight', clientHeight, 'scrollTop', scrollTop, getPostsStatus.status, scrollTop + clientHeight + 500 >= scrollHeight && posts.length < totalPostsCount && getPostsStatus.status !== config.status.started, posts.length, totalPostsCount);*/

			if (scrollTop + clientHeight + 500 >= scrollHeight && posts.length < totalPostsCount && getPostsStatus.status !== config.status.started) {
				window.removeEventListener(
					'scroll',
					handleLoadMorePosts
				);
				setPostsOffset((prevOffset) => +prevOffset + config.getPostsLimit)
			}
		},
		[posts, totalPostsCount, setPostsOffset, getPostsStatus.status]
	);

	useEffect(
		() => {
			getPosts();
		},
		[getPosts]
	);

	useEffect(
		() => {
			window.addEventListener(
				'scroll',
				handleLoadMorePosts,
				{
					passive: false
				}
			);
			return () => {
				window.removeEventListener(
					'scroll',
					handleLoadMorePosts
				)
			};
		},
		[handleLoadMorePosts]
	);
	return (
		<div className="allPosts-container">
			{
				posts.map(post => (
					<Post
						key={post.postId}
						imageShortName={post.picture.shortName}
						imageFullUrl={post.picture.fullUrl}
						imageProvider={post.picture.providerName}
						caption={post.caption}
						tags={post.tags}
						postId={post.postId}
					/>
				))
			}
			<Loader
				showLoader={getPostsStatus.status === config.status.started}
			/>
		</div>
	)
};

AllPosts.propTypes = {};

export default AllPosts
