/* eslint-disable @typescript-eslint/no-var-requires,no-undef */
const path = require('path')

/**
 * @return {string}
 */
exports.getWorkspaceDir = function() {
  let root = process.cwd()
  while (
    root !== '/'
    // windows
    || /^[a-zA-Z]:\\$/.test(root)
  ) {
    const children = require('fs').readdirSync(root)
    if (children.includes('pnpm-workspace.yaml')) {
      return root
    }
    root = path.dirname(root)
  }
  throw new Error('workspace root not found')
}

// maybe support it like this:
// https://github.com/pnpm/pnpm/blob/1474bfd89a7963884d58c77a1378bf891d3b0226/workspace/find-workspace-dir/src/index.ts#L1
