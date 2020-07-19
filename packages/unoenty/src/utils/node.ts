import ReactDOM from "react-dom"
import React from "react"

class Node {
	renderComponent(id: string, component: React.ReactNode) {
		let node = document.getElementById(id)
	
		if (node) {
			ReactDOM.unmountComponentAtNode(node)
		} else {
			node = document.createElement("div")
			node.setAttribute("id", id)
			document.body.appendChild(node)
		}

		const where = document.getElementById("root") || document.body
			
		const expectedRendering = ReactDOM.createPortal(component, where)
	
		return ReactDOM.render(expectedRendering, node)
	}
}

export default new Node()
