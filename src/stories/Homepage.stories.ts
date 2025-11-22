import type { Meta, StoryObj } from '@storybook/svelte'
import HomePage from '../routes/+page.svelte'

const meta = {
  title: 'Pages/Homepage',
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'desktop'
    },
    controls: { expanded: true }
  },
  tags: ['autodocs']
} satisfies Meta<HomePage>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    }
  }
}

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile'
    }
  }
}
