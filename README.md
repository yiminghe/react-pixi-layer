# react-pixi-layer
---

render pixi elements by layers to improve render performance

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/react-pixi-layer.svg?style=flat-square
[npm-url]: http://npmjs.org/package/react-pixi-layer
[travis-image]: https://img.shields.io/travis/yiminghe/react-pixi-layer.svg?style=flat-square
[travis-url]: https://travis-ci.org/yiminghe/react-pixi-layer
[coveralls-image]: https://img.shields.io/coveralls/yiminghe/react-pixi-layer.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/yiminghe/react-pixi-layer?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/yiminghe/react-pixi-layer.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/yiminghe/react-pixi-layer
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/react-pixi-layer.svg?style=flat-square
[download-url]: https://npmjs.org/package/react-pixi-layer

## demo 

http://yiminghe.me/react-pixi-layer/

```js
import { asyncRenderApp, render } from 'react-pixi-layer';

const RootContainer = () => {
  const [ buttonImage, setButtonImage ] = useState(buttonPng);
  const onPointerdown = useCallback(() => {
    setButtonImage(buttonDownPng);
  }, []);
  const onPointerup = useCallback(() => {
    setButtonImage(buttonPng);
  }, []);
  return <container layers={[ 'bg', 'btn' ]}>
    <sprite image={buttonBgPng} layers="bg"/>
    <sprite image={buttonImage}
            layers="btn"
            position={{ x: 300, y: 200 }}
            interactive
            onPointerdown={onPointerdown}
            onPointerup={onPointerup}
    />
  </container>;
};


const DemoStory = () => {
  const root = useRef();
  useEffect(() => {
    const bgApp = new PIXI.Application({
      width: 800,
      height: 600,
      transparent:true,
      autoStart: false,
    });
    asyncRenderApp(bgApp);
    root.current.appendChild(bgApp.view);
    const btnApp = new PIXI.Application({
      width: 800,
      height: 600,
      transparent:true,
      autoStart: false,
    });
    asyncRenderApp(btnApp);
    btnApp.view.style.position = 'absolute';
    btnApp.view.style.left = 0;
    btnApp.view.style.top = 0;
    root.current.appendChild(btnApp.view);
    bgApp.loader.add(buttonBgPng).add(buttonPng).add(buttonDownPng).load(() => {
      render(<RootContainer/>, {
        layers: {
          bg: bgApp.stage,
          btn: btnApp.stage,
        },
        apps:{
          bg:bgApp,
          btn:btnApp,
        }
      });
    });

  }, []);

  return <div ref={root} style={{ position: 'relative' }}/>;
};
```
