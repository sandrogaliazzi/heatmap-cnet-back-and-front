export function $(query) {
  return document.querySelector(query);
}

export function get(selector) {
  return $(selector).value;
}

export function set(selector, value) {
  $(selector).value = value;
}

export function propCouter(arr) {
  return arr.reduce((counts, prop) => {
    counts[num.cto_name] = (counts[prop] || 0) + 1;
    return counts;
  }, {});
}
