import React, {useState, useEffect} from 'react';
import './styles.scss';
import PropTypes from 'prop-types';
import Header from "../../components/Header";
import AllPosts from "../../components/AllPosts";

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

Dashboard.propTypes = {};

export default Dashboard
