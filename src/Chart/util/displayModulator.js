export function setDpiSupport(canvas, ctx, ratio, rect) {
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

export function getScreenRatio(ratio) {
  if (ratio === null || typeof ratio === 'undefined') {
    return window.devicePixelRatio;
  }
  if (ratio < 2) {
    return 2;
  }
  return ratio;
}
