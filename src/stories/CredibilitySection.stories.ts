import type { Meta, StoryObj } from '@storybook/svelte'
import CredibilitySection from '$lib/components/homepage/CredibilitySection.svelte'
import { credibilitySignals } from '$lib/content/homepage'

const meta = {
  title: 'Homepage/CredibilitySection',
  component: CredibilitySection,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    items: credibilitySignals
  }
} satisfies Meta<CredibilitySection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TwoColumns: Story = {
  args: {
    items: credibilitySignals.slice(0, 2)
  }
}
