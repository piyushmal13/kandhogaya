import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Loader2 } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'UI/SovereignButton',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['sovereign', 'execution', 'secondary', 'ghost', 'danger', 'institutional-outline'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'sovereign-hero'],
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

export const Sovereign: Story = {
  args: {
    variant: 'sovereign',
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
    variant: 'sovereign',
    isLoading: true,
  },
};
