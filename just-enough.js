/**
 * Function to unblock event loop
 */
function runAtNextTick(cb) {
  setTimeout(cb, 0);
}

/**
 * ControllerRegistry - Holds objects of Controllers
 */
class ControllersRegistry {
  static _controllersObjects = {};

  static getController = (controllerName) => {
    if (typeof ControllersRegistry._controllersObjects[controllerName] != 'undefined') {
      return ControllersRegistry._controllersObjects[controllerName];
    }

    return ControllersRegistry.addControllerToRegistry(controllerName);
  };

  static addControllerToRegistry = (controllerName) => {
    ControllersRegistry._controllersObjects[controllerName] = eval('new ' + controllerName + '()');
    return ControllersRegistry._controllersObjects[controllerName];
  };
}

/**
 * Sort of a Controller interface. Other Controllers should extend this class
 */
class Controller {
  constructor() {
    console.log(this.constructor.name);
  }
}

/**
 * EventBinder - Reads HTML and binds event listener callbacks.
 */
class EventBinder {
  static addEventListeners() {
    Array.prototype.slice.call(document.querySelectorAll('*')).forEach(function (el) {
      // Don't block event loop.
      runAtNextTick(() => EventBinder.addEventListener(el));
    });
  }

  static addEventListener(el) {
    const dataAttributeKeys = Object.keys(el.dataset);
    for (const attributeKey of dataAttributeKeys) {
      if (!attributeKey.startsWith('event')) {
        continue;
      }

      const eventListener = el.dataset[attributeKey];

      // get all methods to be invoked on event.
      const methods = eventListener.split(',').map((method) => method.trim());

      // register each method associated with an event as a eventListener.
      methods.forEach((method) => {
        const [controllerName, methodName] = method.split(':');
        const controllerObj = ControllersRegistry.getController(controllerName);
        el.addEventListener(attributeKey.toLowerCase().replace('event', ''), controllerObj[methodName]);
      });
    }
  }
}
