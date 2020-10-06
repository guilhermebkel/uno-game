import React, { useState, useRef, ReactElement } from "react"
import {
	IconButton,
	Drawer,
	Grid,
	Typography,
	TextField,
	Badge,
	Fab,
} from "@material-ui/core"
import {
	ChatOutlined as ChatIcon,
	ArrowBackOutlined as GoBackIcon,
	Send as SendIcon,
} from "@material-ui/icons"

import { Divider } from "@/components"

import useStyles from "@/pages/Table/TableChat/styles"

import useSocket from "@/hooks/useSocket"
import useDidMount from "@/hooks/useDidMount"
import useBackButton from "@/hooks/useBackButton"
import { useSocketStore } from "@/store/Socket"

import DeviceUtil from "@/utils/device"

const Chat = (): ReactElement => {
	const classes = useStyles()
	const socket = useSocket()
	const socketStore = useSocketStore()
	const backButton = useBackButton()

	const [drawerOpened, setDrawerOpened] = useState(false)
	const [content, setContent] = useState("")
	const [notSeenMessagesCount, setNotSeenMessagesCount] = useState(0)

	const messageContainerRef = useRef<HTMLElement>(null)

	const scrollChatToBottom = () => {
		if (messageContainerRef.current) {
			messageContainerRef.current.scroll(0, messageContainerRef.current?.scrollHeight)
		}
	}

	const resetNotSeenMessagesCount = () => {
		setNotSeenMessagesCount(0)
	}

	const handleCloseChat = () => {
		resetNotSeenMessagesCount()

		setDrawerOpened(false)
	}

	const handleOpenChat = () => {
		setDrawerOpened(true)

		/**
		 * Workaround to delay this function calling,
		 * in order to make it to be called after the drawer opens
		 */
		setTimeout(() => scrollChatToBottom(), 0)

		if (DeviceUtil.isMobile) {
			backButton.handleBackButton(
				() => handleCloseChat(),
			)
		}
	}

	const handleSendChatMessage = () => {
		const chatId = socketStore?.game?.chatId

		if (chatId) {
			socket.sendChatMessage(chatId, content)
		}

		setContent("")
	}

	const increaseNotSeenMessagesCount = (amount: number) => {
		setNotSeenMessagesCount(lastState => lastState + amount)
	}

	const handleNewChatMessage = () => {
		scrollChatToBottom()

		increaseNotSeenMessagesCount(+1)
	}

	const onNewChatMessage = () => {
		socket.onNewChatMessage(() => handleNewChatMessage())
	}

	const handleChangeContent = (value: string) => {
		setContent(value)
	}

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		handleSendChatMessage()
	}

	const onInputFocus = () => {
		backButton.setActive(false)
	}

	const onInputBlur = () => {
		backButton.setActive(true)
	}

	useDidMount(() => {
		onNewChatMessage()
	})

	return (
		<>
			{socketStore?.chat && (
				<Grid
					container
					className={classes.openChatButtonContainer}
				>
					<Fab
						onClick={handleOpenChat}
						color="default"
					>
						<Badge
							badgeContent={notSeenMessagesCount}
							color="primary"
						>
							<ChatIcon />
						</Badge>
					</Fab>
				</Grid>
			)}

			<Drawer
				open={drawerOpened}
				onClose={handleCloseChat}
				anchor="right"
				PaperProps={{
					className: classes.drawerPaper,
				}}
				className={classes.drawer}
			>
				<Grid
					container
					alignItems="center"
					className={classes.drawerHeaderContainer}
				>
					<IconButton
						onClick={handleCloseChat}
						size="medium"
						color="primary"
					>
						<GoBackIcon />
					</IconButton>

					<Typography
						variant="h6"
					>
						Chat
					</Typography>
				</Grid>

				<Grid
					className={classes.drawerBodyContainer}
					innerRef={messageContainerRef}
				>
					{socketStore?.chat?.messages?.map((message, index) => (
						<React.Fragment key={index}>
							<Typography
								variant="body1"
							>
								<b>{message.playerName}:</b> {message.content}
							</Typography>

							<Divider size={1} />
						</React.Fragment>
					))}
				</Grid>

				<Grid
					component="form"
					container
					alignItems="center"
					className={classes.drawerFooterContainer}
					onSubmit={handleSubmit}
				>
					<TextField
						value={content}
						onChange={({ target }) => handleChangeContent(target.value)}
						placeholder="Type something..."
						variant="outlined"
						className={classes.messageInput}
						size="small"
						onFocus={() => onInputFocus()}
						onBlur={() => onInputBlur()}
					/>

					<IconButton
						size="medium"
						onClick={handleSendChatMessage}
						color="primary"
					>
						<SendIcon />
					</IconButton>
				</Grid>

			</Drawer>
		</>
	)
}

export default Chat
