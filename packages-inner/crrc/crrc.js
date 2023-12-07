/* eslint-disable @typescript-eslint/no-var-requires,no-undef */
const { spawn } = require('node:child_process')
const path = require('node:path')
const dotenv = require('dotenv')

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
const envs = {
  ...dotenv.config({ path: path.join(workspaceRoot, '.env') }).parsed,
  ...dotenv.config({ path: path.join(workspaceRoot, '.env.local') }).parsed,
  ...dotenv.config({ path: path.join(workspaceRoot, '.env.dev') }).parsed
}

const env = Object.keys(envs)
  .map((key) => `${key}='${
    envs[key]
      .replace(/'/g, '\\\'')
      .replace('{{P_ROOT}}', workspaceRoot)
  }'`)
  .join(' ')
const prefix = `node ${crossEnvBin} ${env}`
const command = `${prefix} ${args.join(' ')}`

const child = spawn(command, { stdio: 'inherit', shell: true })

child.on('exit', function (code, signal) {
  process.exit(code)
})
