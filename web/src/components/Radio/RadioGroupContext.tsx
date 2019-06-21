import React, { ChangeEvent, Context } from 'react';

export type RadioGroupContextType = {
  value: string;
  name?: string;
  onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => any;
  disabled: boolean;
};

export const RadioGroupContext: Context<RadioGroupContextType | null> = React.createContext<RadioGroupContextType | null>(
  null
);
