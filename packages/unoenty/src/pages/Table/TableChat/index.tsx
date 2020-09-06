import React, { useState, useRef } from "react"
import {
	IconButton,
	Drawer,
	Grid,
	Typography,
	TextField
} from "@material-ui/core"
import {
	ChatOutlined as ChatIcon,
	ArrowBackOutlined as GoBackIcon,
	Send as SendIcon
} from "@material-ui/icons"

import { Divider } from "@/components"

import useStyles from "@/pages/Table/TableChat/styles"

import useSocket from "@/hooks/useSocket"
import useDidMount from "@/hooks/useDidMount"
import { useSocketStore } from "@/store/Socket"

const Chat: React.FC = () => {
	const classes = useStyles()
	const socket = useSocket()
	const socketStore = useSocketStore()

	const [drawerOpened, setDrawerOpened] = useState(false)
	const [content, setContent] = useState("")

	const messageContainerRef = useRef<HTMLElement>(null)

	const scrollChatToBottom = () => {
		messageContainerRef.current?.scroll(0, document.body.scrollHeight)
	}

	const handleOpenChat = () => {
		setDrawerOpened(true)

		setTimeout(() => scrollChatToBottom(), 0)
	}

	const handleCloseChat = () => {
		setDrawerOpened(false)
	}

	const handleSendChatMessage = () => {
		const chatId = socketStore?.game?.chatId

		if (chatId) {
			socket.sendChatMessage(chatId, content)
		}

		setContent("")
	}

	const handleChangeContent = (value: string) => {
		setContent(value)
	}

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()

		handleSendChatMessage()
	}

	useDidMount(() => {
		socket.onNewChatMessage(() => scrollChatToBottom())
	})

	return (
		<>
			{socketStore?.chat && (
				<IconButton
					className={classes.openChatButton}
					onClick={handleOpenChat}
					size="medium"
				>
					<ChatIcon />
				</IconButton>
			)}

			<Drawer
				open={drawerOpened}
				onClose={handleCloseChat}
				anchor="right"
				PaperProps={{
					className: classes.drawerPaper
				}}
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
					{socketStore?.chat?.messages?.map(message => (
						<>
							<Typography
								variant="body1"
							>
								<b>{message.playerName}:</b> {message.content}
							</Typography>

							<Divider size={1} />
						</>
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
						autoFocus
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
