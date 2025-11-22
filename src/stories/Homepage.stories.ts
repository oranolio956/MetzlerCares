import type { Meta, StoryObj } from '@storybook/svelte'
import HomePage from '../routes/+page.svelte'
import { getHomepageContent } from '$lib/content/homepage'

const defaultData = getHomepageContent('en')

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
  tags: ['autodocs'],
  args: {
    data: defaultData
  },
  argTypes: {
    data: {
      control: 'object',
      description: 'Structured homepage content resolved via CMS/server load.'
    }
  }
} satisfies Meta<HomePage>

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  args: {
    data: defaultData
  }
}

export const Tablet: Story = {
  args: {
    data: defaultData
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    }
  }
}

export const Mobile: Story = {
  args: {
    data: defaultData
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile'
    }
  }
}
