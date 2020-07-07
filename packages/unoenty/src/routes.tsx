import React from "react"
import { Route, Switch } from "react-router-dom"

import { PageNotFound } from "./components"

import Dashboard from "./pages/Dashboard"
import Table from "./pages/Table"

const Routes = () => (
	<Switch>
		<Route exact path="/" component={Dashboard} />
		<Route exact path="/table/:table_id" component={Table} />
		<Route path="*" component={PageNotFound} />
	</Switch>
)

export default Routes
