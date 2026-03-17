import { useEffect, useState } from 'react';
import AllPosts from "../../components/AllPosts";
import Header from "../../components/Header";
import './styles.scss';

const Dashboard = props => {
	const [opacity, setOpacity] = useState(0);

	useEffect(
		() => {
			setOpacity(1);
		},
		[setOpacity]
	);

	return (
		<div className="dashboard-container" style={{opacity}}>
			<Header/>
			<AllPosts/>
		</div>
	)
};

export default Dashboard
