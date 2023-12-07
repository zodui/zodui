/* eslint-disable @typescript-eslint/no-var-requires,no-undef */
const { spawn } = require('node:child_process')
const path = require('node:path')
// TODO 不想用，因为里面有个 findup 是 s 先生写的，真难受，不能自己写一个吗
const { findWorkspaceDir } = require('@pnpm/find-workspace-dir')

const args = process.argv.slice(2)

const crossEnvBin = path.join(
  path.dirname(require.resolve('cross-env')),
  'bin/cross-env.js'
)

;(async () => {
  const workspaceRoot = await findWorkspaceDir(process.cwd())
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
})()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
