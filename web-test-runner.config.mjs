import {esbuildPlugin} from '@web/dev-server-esbuild'

export default {
  nodeResolve: true,
  esbuildTarget: 'auto',
  files: ['test/test.js', 'src/index.ts'],
  plugins: [esbuildPlugin({ts: true})]
}
