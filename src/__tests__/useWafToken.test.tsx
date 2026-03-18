import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { useWafToken } from '../useWafToken';
import { WafContext } from '../WafContext';
import type { WafClient } from '../types';

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

describe('useWafToken', () => {
  it('throws when used outside WafProvider', () => {
    // Suppress console.error for expected error
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useWafToken())).toThrow(
      'useWafClient must be used within a <WafProvider>',
    );
    spy.mockRestore();
  });

  it('returns initial state with null token', () => {
    const mockClient: WafClient = {
      getToken: jest.fn().mockResolvedValue('token'),
      hasToken: jest.fn().mockResolvedValue(true),
      fetch: jest.fn().mockResolvedValue({ status: 200, headers: {}, body: '' }),
      isReady: false,
    };

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(WafContext.Provider, { value: mockClient }, children);

    const { result } = renderHook(() => useWafToken(), { wrapper });

    expect(result.current.token).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.refresh).toBe('function');
  });
});
