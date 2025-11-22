import type { Meta, StoryObj } from '@storybook/svelte'
import OperatingBlueprintSection from '$lib/components/homepage/OperatingBlueprintSection.svelte'
import { operatingLoops, platformPillars } from '$lib/content/homepage'

const meta = {
  title: 'Homepage/OperatingBlueprintSection',
  component: OperatingBlueprintSection,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    loops: operatingLoops,
    pillars: platformPillars
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
