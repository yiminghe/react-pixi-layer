import { addParameters, configure } from '@storybook/react';

addParameters({
  options: {
    showAddonsPanel: false,
    theme: {
      brandTitle: 'react-pixi-layer',
      brandUrl: 'https://github.com/yiminghe/react-pixi-layer/',
    },
  },
});

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.story.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
