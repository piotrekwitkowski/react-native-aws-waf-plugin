module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-webview)/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '__mocks__', '/example/'],
};
