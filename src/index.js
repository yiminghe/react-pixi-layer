import ReactReconciler from 'react-reconciler';
import hostConfig, { eventHandler } from './render/hostConfig';
import registerComponent from './render/registerComponent';
import { version } from '../package';
import './components/index';

const reconciler = ReactReconciler(hostConfig);

eventHandler.batchedUpdates = fn => reconciler.batchedUpdates(fn);

reconciler.injectIntoDevTools({
  findFiberByHostInstance: reconciler.findFiberByHostInstance,
  bundleType: 1,
  version,
  rendererPackageName: 'react-pixi-layer',
});

export { registerComponent };

export * from './render/ReactPortal';

export function render(rootElement, container) {
  if (!container._rootContainer) {
    container._rootContainer = reconciler.createContainer(
      container,
      false,
      false,
    );
  }

  reconciler.updateContainer(rootElement, container._rootContainer);
}

export function asyncRenderApp(app) {
  if (!app.asyncRender) {
    app.asyncRender = function() {
      if (!this.__asyncing) {
        this.__asyncing = true;

        const run = () => {
          app.render();
          this.__asyncing = false;
        };

        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(run);
        } else {
          Promise.resolve().then(run);
        }
      }
    };
  }
}
