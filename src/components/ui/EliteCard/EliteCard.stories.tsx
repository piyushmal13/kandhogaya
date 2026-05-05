import type { Meta, StoryObj } from '@storybook/react';
import { EliteCard } from './EliteCard';

const meta: Meta<typeof EliteCard> = {
  title: 'UI/EliteCard',
  component: EliteCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EliteCard>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};
