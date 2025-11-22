import type { Meta, StoryObj } from '@storybook/svelte'
import OperatingBlueprintSection from '$lib/components/homepage/OperatingBlueprintSection.svelte'
import { operatingLoops, platformPillars } from '$lib/content/homepage'

const meta = {
  title: 'Homepage/OperatingBlueprintSection',
  component: OperatingBlueprintSection,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true }
  },
  tags: ['autodocs'],
  args: {
    loops: operatingLoops,
    pillars: platformPillars
  },
  argTypes: {
    loops: {
      control: 'object',
      description: 'Narrative describing signal/orchestrate/prove layers.'
    },
    pillars: {
      control: 'object',
      description: 'Technical pillars showcased inside the glass board.'
    }
  }
} satisfies Meta<OperatingBlueprintSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SingleLoop: Story = {
  args: {
    loops: operatingLoops.slice(0, 1)
  }
}
