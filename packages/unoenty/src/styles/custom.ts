import { makeStyles } from "@material-ui/core"

type UseCustomStylesProps = {
	limitedNameWidth?: number
}

const useCustomStyles = makeStyles({
	limitedName: {
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		overflow: "hidden",
		maxWidth: (props: UseCustomStylesProps) => `${props.limitedNameWidth || 200}px`,
	},
})

export default useCustomStyles
