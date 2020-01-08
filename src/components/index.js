import * as PIXI from 'pixi.js';
import registerComponent from '../render/registerComponent';

registerComponent('container', PIXI.Container);

class Sprite extends PIXI.Sprite {
  reactPropsInit(props, init) {
    let newProps = props;
    if (props.image) {
      newProps = {
        ...props,
      };
      delete newProps.image;
      newProps.texture = PIXI.Texture.from(props.image);
    }
    init(this, newProps);
  }

  reactPropsUpdate(updatePayload, oldProps, newProps, update) {
    let newUpdatePayload = updatePayload;
    const index = updatePayload.indexOf('image');
    if (index !== -1) {
      newUpdatePayload = [...updatePayload];
      newUpdatePayload.splice(index, 1);
      this.texture = PIXI.Texture.from(newProps.image);
    }
    update(this, updatePayload, oldProps, newProps);
  }
}

registerComponent('sprite', Sprite);
