import React from "react"
import ReactDOM from "react-dom"
import { ThemeProvider } from "@material-ui/core"
import { BrowserRouter } from "react-router-dom"

import * as serviceWorker from "@/services/service-worker"

import App from "@/App"

import theme from "@/styles/theme"
import "@/styles/global.css"

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById("root"),
)

serviceWorker.register({})
