import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Loader2 } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'UI/EliteButton',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['elite', 'execution', 'secondary', 'ghost', 'danger', 'institutional-outline'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'elite-hero'],
    },
    glowEffect: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    trackingEvent: {
      control: 'text',
      description: 'The IFX Telemetry key to fire when clicked.',
    }
  },
  args: {
    children: 'Deploy Terminal',
  }
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Elite: Story = {
  args: {
    variant: 'elite',
    glowEffect: true,
  },
};

export const Execution: Story = {
  args: {
    variant: 'execution',
    glowEffect: true,
  },
};

export const InstitutionalOutline: Story = {
  args: {
    variant: 'institutional-outline',
  },
};

export const LoadingState: Story = {
  args: {
    variant: 'elite',
    isLoading: true,
  },
};
