import components from './components';

export default function registerComponent(type, constructor) {
  components[type] = constructor;
}
