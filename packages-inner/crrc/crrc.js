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
  const cwd = process.cwd()
  const parts = cwd.split('/')
  while (parts.length) {
    const root = parts.join('/')
    // check the children are included the pnpm-workspace.yaml
    if (root === '/') {
      break
    }
    const children = require('fs').readdirSync(root)
    if (children.includes('pnpm-workspace.yaml')) {
      return root
    }
    parts.pop()
  }
  return cwd
}
const envs = {
  ...dotenv.config({ path: path.join(findWorkspaceRoot(), '.env') }).parsed,
  ...dotenv.config({ path: path.join(findWorkspaceRoot(), '.env.local') }).parsed,
  ...dotenv.config({ path: path.join(findWorkspaceRoot(), '.env.dev') }).parsed
}

const env = Object.keys(envs)
  .map((key) => `${key}='${
    envs[key].replace(/'/g, '\\\'')
  }'`)
  .join(' ')
const prefix = `node ${crossEnvBin} ${env}`
const command = `${prefix} ${args.join(' ')}`

const child = spawn(command, { stdio: 'inherit', shell: true })

child.on('exit', function (code, signal) {
  process.exit(code)
})
