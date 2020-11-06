import { createMuiTheme } from "@material-ui/core"

import colors from "@/styles/colors"

const defaultTheme = createMuiTheme()

export default createMuiTheme({
	palette: {
		background: {
			default: colors.palette.black1,
		},
		primary: {
			main: colors.palette.purple1,
		},
		secondary: {
			main: "#FFD164",
		},
		text: {
			primary: colors.grayScale[1],
			secondary: colors.grayScale[15],
		},
		success: {
			main: "#07C50E",
		},
		warning: {
			main: "#F3CA12",
		},
		error: {
			main: "#ff361c",
		},
		info: {
			main: "#222329",
		},
		action: {
			disabledBackground: colors.grayScale[10],
			disabled: colors.grayScale[2],
		},
	},
	overrides: {
		MuiButton: {
			root: {
				borderRadius: defaultTheme.spacing(2),
				textTransform: "none",
			},
		},
	},
	typography: {
		fontFamily: "Ubuntu",
		h1: {
			fontWeight: "bold",
			fontSize: 50,
		},
		h2: {
			fontWeight: "bold",
			fontSize: 14,
		},
		h3: {
			fontWeight: "normal",
			fontSize: 22,
		},
		caption: {
			fontWeight: "normal",
			fontSize: 12,
		},
	},
})
