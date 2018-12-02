/**
 * getMousePos
 * @param {evt} evt 
 * @param {canvas rect} rect 
 */

function getMousePos(evt, rect) {
	return {
		mx: evt.clientX - rect.left,
		my: evt.clientY - rect.top
	}
}

export { getMousePos }
