import { createMuiTheme } from "@material-ui/core"

const palette = {
	light: {
		background: "#F9F9F9",
		text: "#1C2836",
	},
	dark: {
		background: "#1C2836",
		text: "#FFF",
	},
}

const SELECTED_PALETTE = "light"

export default createMuiTheme({
	palette: {
		background: {
			default: palette[SELECTED_PALETTE].background,
		},
		primary: {
			main: "#7233EB",
		},
		secondary: {
			main: "#FFD164",
		},
		text: {
			primary: palette[SELECTED_PALETTE].text,
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
	},
	overrides: {
		MuiTypography: {
			button: {
				textTransform: "none",
			},
		},
		MuiButton: {
			root: {
				textTransform: "none",
			},
		},
		MuiFormLabel: {
			root: {
				color: palette[SELECTED_PALETTE].text,
			},
		},
		MuiFormControlLabel: {
			root: {
				color: palette[SELECTED_PALETTE].text,
			},
		},
		MuiInputBase: {
			root: {
				color: palette[SELECTED_PALETTE].text,
				borderColor: palette[SELECTED_PALETTE].text,
			},
		},
		MuiCheckbox: {
			root: {
				color: palette[SELECTED_PALETTE].text,
			},
		},
		MuiIconButton: {
			root: {
				color: "rgba(255, 255, 255, 1)",
			},
		},
	},
	typography: {
		fontFamily: "Ubuntu",
		h1: {
			fontWeight: "bold",
			fontSize: 50,
		},
		h3: {
			fontWeight: "normal",
			fontSize: 26,
		},
	},
})
