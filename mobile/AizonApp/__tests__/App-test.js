/**
 * @format
 */

import 'react-native';
import React from 'react';
import AizonApp from '../AizonApp';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<AizonApp />);
});
