import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"

import { PageNotFound } from "./components"

import Dashboard from "./pages/Dashboard"
import Table from "./pages/Table"
import Room from "./pages/Room"

const Routes = () => (
	<Switch>
		<Route exact path="/"><Redirect to="/game" /></Route>
		<Route exact path="/game" component={Dashboard} />
		<Route exact path="/game/:gameId/room" component={Room} />
		<Route exact path="/game/:gameId/table" component={Table} />
		<Route path="*" component={PageNotFound} />
	</Switch>
)

export default Routes
