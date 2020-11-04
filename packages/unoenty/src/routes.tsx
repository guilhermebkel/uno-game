import React from "react"
import { Route, Switch } from "react-router-dom"

import { PageNotFound } from "@/components"

import Dashboard from "@/pages/Dashboard"
import Table from "@/pages/Table"
import Room from "@/pages/Room"

const Routes: React.FC = () => (
	<Switch>
		<Route exact path="/" component={Dashboard} />
		<Route exact path="/:gameId" render={({ location }) => <Room key={location.pathname} />} />
		<Route exact path="/:gameId/table" component={Table} />
		<Route path="*" component={PageNotFound} />
	</Switch>
)

export default Routes
