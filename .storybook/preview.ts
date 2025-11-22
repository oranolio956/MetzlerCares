import type { Preview } from '@storybook/svelte'
import '../src/app.css'

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'night',
      values: [
        { name: 'night', value: '#030406' },
        { name: 'slate', value: '#0f172a' },
        { name: 'white', value: '#ffffff' }
      ]
    },
    viewport: {
      viewports: {
        desktop: {
          name: 'Desktop 1440',
          styles: { width: '1440px', height: '900px' },
          type: 'desktop'
        },
        tablet: {
          name: 'Tablet 834',
          styles: { width: '834px', height: '1112px' },
          type: 'tablet'
        },
        mobile: {
          name: 'Mobile 390',
          styles: { width: '390px', height: '844px' },
          type: 'mobile'
        }
      }
    },
    options: {
      storySort: {
        order: ['Pages', 'Components', 'Tokens']
      }
    }
  }
}

export default preview
