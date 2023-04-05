import { defineConfig } from 'astro/config'

import react from '@astrojs/react';
// import preact from '@astrojs/preact';
// import svelte from '@astrojs/svelte';
import vue from '@astrojs/vue';
// import solid from '@astrojs/solid-js';
// import lit from '@astrojs/lit';
// import alpine from '@astrojs/alpinejs';

// https://astro.build/config
export default defineConfig({
  base: '/zodui/',
  integrations: [
    vue(),
    // svelte(),
    react(),
    // preact(),
    // solid(),
    // lit(),
    // alpine()
  ],
  vite: {
    ssr: {
      noExternal: [/tdesign-react/]
    }
  }
});
