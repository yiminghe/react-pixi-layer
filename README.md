# react-pixi-layer
---

render pixi elements by layers to improve render performance

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
