import { defineConfig } from 'eslint/config';
import daStyle from 'eslint-config-dicodingacademy';

export default defineConfig([
  daStyle,
  {
    rules: {
      'camelcase': 'off',
    }
  }
],
);
