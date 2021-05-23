import ReactDOM from "react-dom"
import React from "react"

class Node {
	renderComponent (id: string, component: React.ReactNode) {
		let node = document.getElementById(id)

		if (node) {
			this.unmountComponent(id)
		} else {
			node = document.createElement("div")
			node.setAttribute("id", id)
			document.body.appendChild(node)
		}

		const where = document.body

		const expectedRendering = ReactDOM.createPortal(component, where)

		return ReactDOM.render(expectedRendering, node)
	}

	unmountComponent (id: string) {
		const node = document.getElementById(id)

		if (node) {
			ReactDOM.unmountComponentAtNode(node)
		}
	}
}

export default new Node()
