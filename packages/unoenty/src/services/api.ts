import axios from "axios"

import serverConfig from "@/config/server"

const api = axios.create({
	baseURL: serverConfig.apiUrl,
})

export default api
