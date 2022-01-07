const keyMap = {
  ESC: 27,
  ENTER: 13,
  SPACE: 32,
  BACKSPACE: 8,

  DOWN: 40,
  RIGHT: 39,
  TAB: 9,

  UP: 38,
  LEFT: 37,
};

const isDOMAvailable = typeof window !== 'undefined';
const normalizeKey = (key) => key.toUpperCase();

const listeners = {};
let lastIndex = 0;

const codes = Object.keys(keyMap).reduce((acc, name) => {
  acc[keyMap[name]] = normalizeKey(name);
  return acc;
}, {});

const removeListener = (id) => {
  if (!listeners[id]) return;
  delete listeners[id];
};

/**
 * @function
 * @param {string[]} keyNames
 * @param {function} callback
 * @return {function(): void}
 */
const addListener = (keyNames, callback) => {
  if (typeof callback !== 'function') throw new Error('Listener function required');

  lastIndex += 1;
  const id = lastIndex;

  const keys = keyNames.split(' ').map(normalizeKey);

  listeners[id] = { keys, callback };

  return (() => removeListener(id));
};

const handleKeyDown = (event) => {
  const key = codes[event.keyCode];
  if (!key) return;

  Object.keys(listeners).forEach((id) => {
    // Item may have been deleted during iteration cycle
    if (!listeners[id]) return;
    const { callback, keys } = listeners[id];
    if (keys.includes(key)) callback(event);
  });
};

const attachHandlers = () => document.addEventListener('keydown', handleKeyDown);
if (isDOMAvailable) attachHandlers();

export { keyMap as keys };
export default addListener;
