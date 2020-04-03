import React from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route} from "react-router-dom";
import Dashboard from "./containerComponents/Dashboard";

const AppRouter = props => {
	return (
		<>
			<CustomRoute
				path={'/'}
				condition={() => true}
				privateComponent={Dashboard}
				exact
			/>
		</>
	)
};

const CustomRoute = ({
	                     privateComponent: PrivateComponent,
	                     fallbackComponent: FallbackComponent,
	                     fallbackRoute,
	                     condition,
	                     ...restProps
                     }) => (
	<Route
		{
			...restProps
		}
		render={
			(props) => {
				return condition() ?
					<PrivateComponent
						{
							...props
						}
					/> :
					FallbackComponent ?
						<FallbackComponent
							{
								...props
							}
						/> :
						<Redirect
							to={
								{
									pathname: fallbackRoute
								}
							}
						/>
			}
		}
	/>
);
CustomRoute.propTypes = {
	exact: PropTypes.any,
	path: PropTypes.string.isRequired,
	privateComponent: PropTypes.func.isRequired,
	fallbackComponent: PropTypes.func,
	fallbackRoute: PropTypes.string,
	condition: PropTypes.func.isRequired
};

AppRouter.propTypes = {};

export default AppRouter
