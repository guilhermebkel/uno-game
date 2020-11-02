import React, { useState } from "react"
import {
	SwipeableDrawer as Drawer,
	Grid,
	Typography,
	List,
	ListItemIcon,
	ListItemText,
	Button,
	IconButton,
} from "@material-ui/core"
import {
	SportsEsports as GameIcon,
	ExitToApp as LogoutIcon,
	GitHub as GithubIcon,
	Menu as MenuIcon,
} from "@material-ui/icons"

import {
	Avatar,
	Divider,
	PopConfirm,
} from "@/components"

import Auth from "@/services/auth"
import { onEvent } from "@/services/event"

import DeviceUtil from "@/utils/device"

import { useSocketStore } from "@/store/Socket"

import useStyles from "@/components/Menu/styles"
import useCustomStyles from "@/styles/custom"

import useDidMount from "@/hooks/useDidMount"

import GameItem from "@/components/Menu/GameItem"
import ListItem from "@/components/Menu/ListItem"

const Menu: React.FC = () => {
	const socketStore = useSocketStore()

	const [opened, setOpened] = useState(!DeviceUtil.isMobile)
	const [isTablePage, setIsTablePage] = useState(false)

	const customClasses = useCustomStyles({})
	const classes = useStyles()

	const isTablePagePath = window.location.pathname.includes("table")

	if (!isTablePagePath && isTablePage) {
		setIsTablePage(false)
	}

	const handleLogout = () => {
		PopConfirm.open({
			title: "Logout",
			message: "Are you sure you want to logout?",
			onConfirm: () => {
				Auth.logout()
			},
		})
	}

	const handleCloseMenu = () => {
		setOpened(false)
	}

	const handleOpenMenu = () => {
		setOpened(true)
	}

	const handleToggleMenu = () => {
		setOpened(lastState => !lastState)
	}

	useDidMount(() => {
		onEvent("GameTableOpened", () => {
			setIsTablePage(true)
			setOpened(false)
		})
	})

	return (
		<>
			{(DeviceUtil.isMobile || isTablePage) && (
				<Grid
					container
					className={classes.menuIconContainer}
				>
					<IconButton
						onClick={handleToggleMenu}
						className={classes.menuIcon}
					>
						<MenuIcon />
					</IconButton>
				</Grid>
			)}

			<Drawer
				open={opened}
				onClose={handleCloseMenu}
				onOpen={handleOpenMenu}
				variant={(DeviceUtil.isMobile || isTablePage) ? "temporary" : "permanent"}
				anchor="left"
				style={{
					zIndex: 99999,
				}}
				PaperProps={{
					className: classes.drawerPaper,
				}}
			>
				<Grid
					container
					direction="column"
					justify="space-between"
					className={classes.content}
				>
					<Grid
						container
						direction="column"
					>
						<Grid
							container
							justify="flex-start"
							alignItems="center"
							className={classes.avatarContainer}
						>
							<Avatar
								size="large"
								name={socketStore?.player?.name || ""}
							/>

							<Typography
								variant="h3"
								className={`${classes.avatarName} ${customClasses.limitedName}`}
							>
								{socketStore?.player?.name}
							</Typography>
						</Grid>

						<Divider orientation="horizontal" size={4} />

						<Typography
							variant="h2"
							className={classes.menuTitle}
						>
							PAGES
						</Typography>

						<Divider orientation="horizontal" size={1} />

						<List onClick={handleCloseMenu}>
							<ListItem to="/">
								<ListItemIcon>
									<GameIcon
										fontSize="large"
										className={classes.listItemIcon}
									/>
								</ListItemIcon>
								<ListItemText
									primary="Games"
									primaryTypographyProps={{
										variant: "h3",
										className: classes.listItemText,
									}}
								/>
							</ListItem>
						</List>

						<Divider orientation="horizontal" size={4} />

						<Typography
							variant="h2"
							className={classes.menuTitle}
						>
							LAST GAMES
						</Typography>

						<Divider orientation="horizontal" size={1} />

						<List onClick={handleCloseMenu}>
							{socketStore.gameHistory
							?.sort((a, b) => b.createdAt - a.createdAt)
							.slice(0, 3)
							.map((gameHistory) => (
								<ListItem
									to={`/${gameHistory.gameId}`}
									status={gameHistory.status}
								>
									<GameItem
										playersCount={gameHistory.playersCount}
										name={gameHistory.name}
										status={gameHistory.status}
									/>
								</ListItem>
							))}
						</List>
					</Grid>

					<Grid
						container
						direction="column"
						alignItems="center"
					>
						<Button
							startIcon={<LogoutIcon />}
							className={classes.logoutButton}
							onClick={handleLogout}
						>
							LOGOUT
						</Button>

						<Divider orientation="horizontal" size={1} />

						<Button
							variant="text"
							href="https://github.com/guilhermebkel/uno-game"
							target="_blank"
							startIcon={<GithubIcon />}
							className={classes.githubButton}
						>
							Give us a star on Github
						</Button>
					</Grid>
				</Grid>
			</Drawer>
		</>
	)
}

export default Menu
