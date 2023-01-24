export function spinner(size, color) {
  return `<div class="spinner-border text-${color}" role="status" style="width:${size.width}; height:${size.height}"> 
  <span class="visually-hidden">Loading...</span>
  </div>`;
}