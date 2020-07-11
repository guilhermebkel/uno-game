import { useEffect } from "react"

// eslint-disable-next-line
const useDidMount = (f: any) => useEffect(() => f && f(), [])

export default useDidMount
