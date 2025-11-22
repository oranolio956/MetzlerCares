import type { Meta, StoryObj } from '@storybook/svelte'
import HeroSection from '$lib/components/homepage/HeroSection.svelte'
import { heroSignals } from '$lib/content/homepage'

const meta = {
  title: 'Homepage/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true }
  },
  tags: ['autodocs'],
  args: {
    signals: heroSignals
  },
  argTypes: {
    signals: {
      control: 'object',
      description: 'Array of hero metric cards rendered beneath the CTA.'
    }
  }
} satisfies Meta<HeroSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ShortCopy: Story = {
  args: {
    signals: heroSignals.slice(0, 2)
  }
}
