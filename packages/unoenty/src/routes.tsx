import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"

import { PageNotFound } from "@unoenty/components"

import Dashboard from "@unoenty/pages/Dashboard"
import Table from "@unoenty/pages/Table"
import Room from "@unoenty/pages/Room"

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
