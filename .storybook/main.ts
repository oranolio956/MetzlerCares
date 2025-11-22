import type { StorybookConfig } from '@storybook/svelte-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/svelte-vite',
    options: {}
  },
  core: {
    disableTelemetry: true
  },
  docs: {
    defaultName: 'Guide'
  }
}

export default config
