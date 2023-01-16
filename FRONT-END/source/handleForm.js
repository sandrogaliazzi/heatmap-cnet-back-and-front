export function $(query) {
  return document.querySelector(query);
}

export function get(selector) {
  return $(selector).value;
}

export function set(selector, value) {
  $(selector).value = value;
}
