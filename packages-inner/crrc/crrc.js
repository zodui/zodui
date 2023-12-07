/* eslint-disable @typescript-eslint/no-var-requires,no-undef */
const { spawn } = require('node:child_process')
const path = require('node:path')
const { getWorkspaceDir } = require('pnpm-helper/getWorkspaceDir')

const args = process.argv.slice(2)

const crossEnvBin = path.join(
  path.dirname(require.resolve('cross-env')),
  'bin/cross-env.js'
)

const workspaceRoot = getWorkspaceDir()
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

child.on('exit', code => process.exit(code))
