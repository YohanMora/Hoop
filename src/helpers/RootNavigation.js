import * as React from 'react';
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();
export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function goBack() {
  return navigationRef.current?.goBack();
}

export function setOptions(options) {
  console.log(navigationRef.current);
  return navigationRef.current?.setOptions(options);
}

export function openDrawer() {
  return navigationRef.current?.openDrawer();
}
