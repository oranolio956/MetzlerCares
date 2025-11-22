import type { Meta, StoryObj } from '@storybook/svelte'
import OutcomesSection from '$lib/components/homepage/OutcomesSection.svelte'
import { outcomeStats } from '$lib/content/homepage'

const meta = {
  title: 'Homepage/OutcomesSection',
  component: OutcomesSection,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true }
  },
  tags: ['autodocs'],
  args: {
    stats: outcomeStats
  },
  argTypes: {
    stats: {
      control: 'object',
      description: 'Outcome metric cards (value, label, context).'
    }
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
