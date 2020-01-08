import components from './components';
// import debugMethods from './debug-methods';
import set from 'lodash.set';

function forEachInstance(instance, fn) {
  if (instance.isSupportReactLayers) {
    Object.keys(instance.layers).forEach(app => {
      fn(instance.layers[app], app);
    });
  } else {
    fn(instance);
  }
}

function invalidateAppByComponent(c) {
  const app = getAppByComponent(c);
  if (app && app.asyncRender) {
    app.asyncRender();
  }
}

function appendChild(parent, child) {
  if (child.isSupportReactLayers) {
    forEachInstance(child, (instance, app) => {
      parent.layers[app].addChild(instance);
      invalidateAppByComponent(parent.layers[app]);
    });
  } else if (parent.isSupportReactLayers) {
    forEachInstance(parent, instance => {
      instance.addChild(child);
      invalidateAppByComponent(instance);
    });
  } else {
    parent.addChild(child);
    invalidateAppByComponent(parent);
  }
}

function insertBefore(parent, child, beforeChild) {
  const beforeChildIndex = parent.getChildIndex(beforeChild);
  if (child.isSupportReactLayers) {
    forEachInstance(child, (instance, app) => {
      parent.layers[app].addChildAt(instance, beforeChildIndex);
      invalidateAppByComponent(parent.layers[app]);
    });
  } else if (parent.isSupportReactLayers) {
    forEachInstance(parent, instance => {
      instance.addChildAt(child, beforeChildIndex);
      invalidateAppByComponent(instance);
    });
  } else {
    parent.addChildAt(child, beforeChildIndex);
    invalidateAppByComponent(parent);
  }
}

function removeChild(parent, child) {
  if (child.isSupportReactLayers) {
    forEachInstance(child, (instance, app) => {
      parent.layers[app].removeChild(instance);
      invalidateAppByComponent(parent.layers[app]);
    });
  } else if (parent.isSupportReactLayers) {
    forEachInstance(parent, instance => {
      instance.removeChild(child);
      invalidateAppByComponent(instance);
    });
  } else {
    parent.removeChild(child);
    invalidateAppByComponent(parent);
  }
}

const eventReg = /^on([A-Z]\w*)/;

function getEventName(name) {
  const match = name.match(eventReg);
  return match && match[1] && match[1].toLowerCase();
}

function addEvent(inst, eventName, fn) {
  inst.on(eventName, (...args) => {
    eventHandler.batchedUpdates(() => fn(...args));
  });
}

function update(inst, updatePayload, oldProps, newProps) {
  let eventName;
  updatePayload.forEach(propName => {
    if (propName === 'children') {
      return;
    }
    eventName = getEventName(propName);
    if (eventName && oldProps && oldProps[propName]) {
      inst.removeListener(eventName);
    }
    if (newProps[propName] || typeof newProps[propName] === 'number') {
      if (eventName) {
        addEvent(inst, eventName, newProps[propName]);
      } else {
        set(inst, propName, newProps[propName]);
      }
    } else if (!eventName) {
      set(inst, propName, undefined);
    }
  });
}

function init(inst, props) {
  update(inst, Object.keys(props), null, props);
}

function mapLayers(layersProp, fn) {
  if (!layersProp) {
    return fn();
  }
  const ret = {
    layers: {},
    isSupportReactLayers: 1,
  };
  const layers = ret.layers;
  if (typeof layersProp === 'string') {
    layers[layersProp] = fn(layersProp);
  } else {
    layersProp.forEach(app => {
      layers[app] = fn(app);
    });
  }
  return ret;
}

function getAppByComponent(c) {
  let component = c;
  if (typeof component._reactApp !== 'undefined') {
    return component._reactApp;
  }
  while (c) {
    if (typeof c._reactApp !== 'undefined') {
      component._reactApp = c._reactApp;
      return c._reactApp;
    }
    c = c.parent;
  }
  component._reactApp = null;
  return null;
}

const hostConfig = {
  now: Date.now,

  getPublicInstance(inst) {
    return inst && inst.isSupportReactLayers ? inst.layers : inst;
  },

  getRootHostContext() {
    return {};
  },

  shouldSetTextContent() {
    return false;
  },

  prepareForCommit() {},

  resetAfterCommit() {},

  getChildHostContext(parentContext) {
    return parentContext;
  },

  createInstance(type, newProps, container) {
    const Component = components[type];
    if (Component) {
      return mapLayers(container.layers && newProps.layers, app => {
        const inst = new Component();
        if (app) {
          inst._reactApp = container.apps[app];
        }
        return inst;
      });
    } else {
      throw new Error('Can not find Component:', type);
    }
  },

  createTextInstance(text, container) {},

  commitTextUpdate(node, oldText, newText) {},

  prepareUpdate(node, type, oldProps, newProps) {
    const diff = [];
    Object.keys(newProps).forEach(function(k) {
      if (newProps[k] !== oldProps[k]) {
        diff.push(k);
      }
    });
    Object.keys(oldProps).forEach(function(k) {
      if (!(k in newProps)) {
        diff.push(k);
      }
    });
    return diff;
  },

  commitUpdate(nodes, updatePayload, type, oldProps, newProps) {
    forEachInstance(nodes, node => {
      if (node.reactPropsUpdate) {
        node.reactPropsUpdate(updatePayload, oldProps, newProps, update);
      } else {
        update(node, updatePayload, oldProps, newProps);
      }
      if (updatePayload.length) {
        invalidateAppByComponent(node);
      }
    });
  },

  appendInitialChild: appendChild,

  appendChild: appendChild,

  insertBefore: insertBefore,

  removeChild: removeChild,

  finalizeInitialChildren(inst2, type, props) {
    forEachInstance(inst2, inst => {
      if (inst.reactPropsInit) {
        inst.reactPropsInit(props, init);
      } else {
        init(inst, props);
      }
    });
  },

  appendChildToContainer: appendChild,

  insertInContainerBefore: insertBefore,

  removeChildFromContainer: removeChild,
  //
  // cloneHiddenInstance(inst) {
  //   return inst;
  // },
  //
  // cloneInstance(inst) {
  //   return inst;
  // },

  finalizeContainerChildren() {},

  supportsMutation: true,
};

export const eventHandler = {
  batchedUpdates(fn) {
    fn();
  },
};
export default hostConfig;
// export default debugMethods(hostConfig, []);
