function getMousePos(rect, evt) {
	return {
		mx: evt.clientX - rect.left,
		my: evt.clientY - rect.top
	}
}

export { getMousePos }
