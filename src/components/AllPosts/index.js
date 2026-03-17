import { useCallback, useEffect, useState } from 'react';
import config from '../../config/config';
import { getPosts as getPostsService } from '../../services/axios.services';
import Loader from "../Loader";
import Post from "../Post";
import './styles.scss';

const AllPosts = props => {

	const [posts, setPosts] = useState([]);
	const [totalPostsCount, setTotalPostsCount] = useState(posts.length);
	const [postsOffset, setPostsOffset] = useState(0);
	const [getPostsStatus, setGetPostsStatus] = useState({
		status: config.status.default,
		message: ''
	});

	const getPosts = useCallback(
		() => {
			(async () => {
				try {
					setGetPostsStatus((prevStatus) => ({...prevStatus, status: config.status.started}));
					const {data: {data}} = await getPostsService(postsOffset);
					setTotalPostsCount(data.totalPosts);
					setPosts((prevPosts) => [...prevPosts, ...data.posts]);
					setGetPostsStatus((prevStatus) => ({...prevStatus, status: config.status.success}));
				} catch (e) {
					setGetPostsStatus((prevStatus) => ({...prevStatus, status: config.status.failed}));
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

export default AllPosts
