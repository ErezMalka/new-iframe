export function setIdByQuerySelector(selector, attrName, attrValue) {
  var result = document.querySelector(selector);
  if (result) {
    result.setAttribute(attrName, attrValue);
  } else {
    console.log('Not found');
  }
}
