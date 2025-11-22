import type { Meta, StoryObj } from '@storybook/svelte'
import HeroSection from '$lib/components/homepage/HeroSection.svelte'
import { heroSignals } from '$lib/content/homepage'

const meta = {
  title: 'Homepage/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    signals: heroSignals
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
