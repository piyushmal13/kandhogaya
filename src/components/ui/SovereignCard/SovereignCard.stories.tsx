import type { Meta, StoryObj } from '@storybook/react';
import { SovereignCard } from './SovereignCard';

const meta: Meta<typeof SovereignCard> = {
  title: 'UI/SovereignCard',
  component: SovereignCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SovereignCard>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
