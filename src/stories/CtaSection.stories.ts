import type { Meta, StoryObj } from '@storybook/svelte'
import CtaSection from '$lib/components/homepage/CtaSection.svelte'

const meta = {
  title: 'Homepage/CtaSection',
  component: CtaSection,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true }
  },
  tags: ['autodocs']
} satisfies Meta<CtaSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
