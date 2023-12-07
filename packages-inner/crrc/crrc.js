/* eslint-disable @typescript-eslint/no-var-requires,no-undef */
const { spawn } = require('node:child_process')
const path = require('node:path')

const args = process.argv.slice(2)

const crossEnvBin = path.join(
  path.dirname(require.resolve('cross-env')),
  'bin/cross-env.js'
)

function findWorkspaceRoot() {
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
const workspaceRoot = findWorkspaceRoot()
const envFileContent = require('fs')
  .readFileSync(path.join(workspaceRoot, '.env.dev'))
  .toString()
  .replace('{{P_ROOT}}', `file:${workspaceRoot}`)

const env = envFileContent
  .split('\n')
  .filter((line) => !line.startsWith('#'))
  .join(' ')
const prefix = `node ${crossEnvBin} ${env}`
const command = `${prefix} ${args.join(' ')}`

const child = spawn(command, { stdio: 'inherit', shell: true })

child.on('exit', function (code, signal) {
  process.exit(code)
})
