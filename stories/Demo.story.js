import { asyncRenderApp, render } from '../src';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { storiesOf } from '@storybook/react';
import * as PIXI from 'pixi.js';
import buttonPng from './button.png';
import buttonBgPng from './button_test_BG.jpeg';
import buttonDownPng from './buttonDown.png';

const DemoStory = () => {
  const root = useRef();
  useEffect(() => {
    const bgApp = new PIXI.Application({
      width: 800,
      height: 600,
      transparent: true,
      autoStart: false,
    });
    asyncRenderApp(bgApp);
    root.current.appendChild(bgApp.view);
    const btnApp = new PIXI.Application({
      width: 800,
      height: 600,
      transparent: true,
      autoStart: false,
    });
    asyncRenderApp(btnApp);
    btnApp.view.style.position = 'absolute';
    btnApp.view.style.left = 0;
    btnApp.view.style.top = 0;
    root.current.appendChild(btnApp.view);
    bgApp.renderer.plugins.interaction.setTargetElement(btnApp.view);

    bgApp.loader
      .add(buttonBgPng)
      .add(buttonPng)
      .add(buttonDownPng)
      .load(() => {
        render(<RootContainer />, {
          layers: {
            bg: bgApp.stage,
            btn: btnApp.stage,
          },
          apps: {
            bg: bgApp,
            btn: btnApp,
          },
        });
      });
  }, []);

  return <div ref={root} style={{ position: 'relative' }} />;
};

const RootContainer = () => {
  const [buttonImage, setButtonImage] = useState(buttonPng);

  const onPointerdown = useCallback(() => {
    setButtonImage(buttonDownPng);
  }, []);

  const onPointerup = useCallback(() => {
    setButtonImage(buttonPng);
  }, []);

  const onPointertap = useCallback(() => {
    console.log('onPointertap');
  }, []);

  return (
    <container layers={['bg', 'btn']}>
      <sprite image={buttonBgPng} layers="bg" />
      {/*<sprite image={buttonImage}*/}
      {/*        layers="bg"*/}
      {/*        position={{ x: 0, y: 0 }}*/}
      {/*        interactive*/}
      {/*        onPointertap={onPointertap}*/}
      {/*        onPointerdown={onPointerdown}*/}
      {/*        onPointerup={onPointerup}*/}
      {/*/>*/}
      <sprite
        image={buttonImage}
        layers="btn"
        position={{ x: 300, y: 200 }}
        interactive
        onPointertap={onPointertap}
        onPointerdown={onPointerdown}
        onPointerup={onPointerup}
      />
    </container>
  );
};

storiesOf('demo', module).add('index', () => <DemoStory />);

export default DemoStory;
