import { mount } from 'svelte';
import App from './App.svelte';

const stickySidebar = document.querySelector('[data-testid="sticky-sidebar"]');

if (stickySidebar)
  mount(App, {
    target: stickySidebar,
  });
