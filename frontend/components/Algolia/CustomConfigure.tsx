import React from 'react';
import { useConfigure, UseConfigureProps } from 'react-instantsearch';

export function CustomConfigure(props: UseConfigureProps) {
  useConfigure(props);
  return null;
}