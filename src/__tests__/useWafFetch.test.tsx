import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { useWafFetch } from '../useWafFetch';

jest.mock('react-native-webview', () => {
  const { View } = require('react-native');
  const RealReact = require('react');
  const MockWebView = RealReact.forwardRef(
    (props: Record<string, unknown>, ref: React.Ref<unknown>) =>
      RealReact.createElement(View, { ...props, ref, testID: 'mock-webview' }),
  );
  MockWebView.displayName = 'MockWebView';
  return { __esModule: true, default: MockWebView };
});

describe('useWafFetch', () => {
  it('throws when used outside WafProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useWafFetch())).toThrow(
      'useWafClient must be used within a <WafProvider>',
    );
    spy.mockRestore();
  });
});
