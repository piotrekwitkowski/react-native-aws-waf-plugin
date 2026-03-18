import React from 'react';
import { View } from 'react-native';

export type MockWebViewProps = {
  source?: { html: string };
  onMessage?: (event: { nativeEvent: { data: string } }) => void;
  style?: Record<string, unknown>;
  pointerEvents?: string;
  originWhitelist?: string[];
  javaScriptEnabled?: boolean;
};

let lastProps: MockWebViewProps | null = null;

export function getLastProps(): MockWebViewProps | null {
  return lastProps;
}

const WebView = React.forwardRef<View, MockWebViewProps>((props, ref) => {
  lastProps = props;
  return React.createElement(View, { ref, testID: 'mock-webview' });
});

WebView.displayName = 'MockWebView';

export default WebView;
