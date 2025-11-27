import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import plugin from '@hapi/eslint-plugin';
import daStyle from 'eslint-config-dicodingacademy';

export default defineConfig([
  daStyle
]
);
