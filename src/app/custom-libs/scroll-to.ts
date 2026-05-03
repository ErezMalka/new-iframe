export default function scrollingToElement(elementId, innerElementTo,  duration, callback?) {
  let element = document.getElementById(elementId);
  if (!element) {
    return;
  }
  let innerElement = document.getElementById(innerElementTo);
  if (!innerElement) {
    return;
  }
  let to = innerElement.offsetTop;
  let start = element.scrollTop,
    change = to - start,
    currentTime = 0,
    increment = 20;
  let animateScroll = () => {
    currentTime += increment;
    var val = easeInOutQuad(currentTime, start, change, duration);
    element.scrollTop = val;
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    } else {
      if (callback) {
        callback();
      }
    }
  };
  animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
const easeInOutQuad = (t, b, c, d) => {
  t /= d/2;
  if (t < 1) {
    return c / 2 * t * t + b;
  }
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};


export function scrollCurrentItem(scrollItem, item, callback) {
  let element = document.getElementById(scrollItem);
  if (!element) {
    return;
  }
  let elements = document.getElementsByClassName(item);
  let distanceItems = [];
  for (let i = 0; i< elements.length; i++) {
    const el: any = elements[i];
    distanceItems.push(Math.abs((el.offsetTop) - element.scrollTop))
  }
  let maxItem = Math.min(...distanceItems);
  if (callback) {
    callback({
      item: maxItem,
      index: distanceItems.indexOf(maxItem),
      distanceItemsLength: distanceItems.length,
      distanceItems,
      fullHeight: element.scrollHeight,
      scrollTop: element.scrollTop
    });
  }
  return distanceItems.indexOf(maxItem);
}

export function scrollItem(scrollItem, item, callback) {
  let element = document.getElementById(scrollItem);
  if (!element) {
    return;
  }
  if (callback) {
    callback({
      scrollTop: element.scrollTop
    });
  }
}

export function getDistanceForItems(scrollItem, item, callback) {
  let element = document.getElementById(scrollItem);
  if (!element) {
    return;
  }
  let elements = document.getElementsByClassName(item);
  let distanceItems = [];
  for (let i = 0; i< elements.length; i++) {
    const el: any = elements[i];
    distanceItems.push(Math.abs(el.offsetTop))
  }
  if (callback) {
    callback({
      distanceItems,
      fullHeight: element.scrollHeight,
      scrollTop: element.scrollTop
    });
  }
}

export function scrollToView(selector) {
  const item = document.querySelector(selector);
  if (!item) {
    return;
  }
  item.scrollIntoView({block: "center", behavior: "smooth"});
}

export function scrollByCount(id, pos, count) {
  let elem =  document.getElementById(id);
  if (!elem) {
    return;
  }
  if (pos) {
    elem.scrollTop += count;
  } else {
    elem.scrollTop -= count;
  }
}

export function isScrolledIntoView(elemId, containerId, config?) {
  let elem = document.querySelector(elemId);
  if (!elem) {
    return false;
  }
  let container = document.querySelector(containerId);
  if (!container) {
    return false;
  }
  let docViewTop = container.scrollTop;
  let docViewBottom = docViewTop + container.clientHeight;
  let elemTop = elem.offsetTop;
  let elemBottom = elemTop + elem.clientHeight;
  if (config) {
    config.up ? (((elemBottom - +config.elemBottomOffsetUp) <= docViewBottom) && ((elemTop - +config.elemTopffsetUp) >= docViewTop)) :
      (((elemBottom - +config.elemBottomOffsetDown) <= docViewBottom) && ((elemTop - +config.elemTopffsetUp) >= docViewTop))
  }
  return (((elemBottom - (elem.clientHeight * 1.25)) <= docViewBottom) && ((elemTop - ((elem.clientHeight * 0.25 < 10 ? elem.clientHeight * 0.25 + 10 : elem.clientHeight * 0.25))) >= docViewTop));
}

export function viewPosition(elemId, containerId, config?) {
  let elem = document.querySelector(elemId);
  if (!elem) {
    return 0;
  }
  let container = document.querySelector(containerId);
  if (!container) {
    return 0;
  }
  let docViewTop = container.scrollTop;
  let docViewBottom = docViewTop + container.clientHeight;
  let elemTop = elem.offsetTop;
  let elemBottom = elemTop + elem.clientHeight;
  return elemTop;
}
