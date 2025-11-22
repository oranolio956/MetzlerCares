import type { Meta, StoryObj } from '@storybook/svelte'
import OutcomesSection from '$lib/components/homepage/OutcomesSection.svelte'
import { outcomeStats } from '$lib/content/homepage'

const meta = {
  title: 'Homepage/OutcomesSection',
  component: OutcomesSection,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    stats: outcomeStats
  }
} satisfies Meta<OutcomesSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SingleStat: Story = {
  args: {
    stats: outcomeStats.slice(0, 1)
  }
}
