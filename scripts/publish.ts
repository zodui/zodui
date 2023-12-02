#!/usr/bin/env node
import { findWorkspacePackages } from '@pnpm/workspace.find-packages'
import child_process from 'child_process'
import { Command } from 'commander'
import fs from 'fs'
import path from 'path'

const program = new Command('zodui')

program
  .description('zodui CLI(internal build).')

program
  .option('-t, --tag <tag>', 'publish tag')
  .arguments('[packages...]')
  .description('publish packages')
  .action(async (packages: string[]) => {
    const options = program.opts() as {
      tag?: string
    }
    const tempPublishPath = path.resolve(__dirname, '.temp.publish')
    if (!fs.existsSync(tempPublishPath)) {
      fs.mkdirSync(tempPublishPath)
    }
    const workspaces = await findWorkspacePackages(process.cwd())
    function getWorkspaceManifest(name: string) {
      return workspaces.find(w => w.manifest.name === name)
    }
    function replaceWorkspaceDependency(dependencies: Record<string, string>) {
      return Object.fromEntries(
        Object.entries(dependencies).map(([name, version]) => {
          if (version.startsWith('workspace:')) {
            const prefix = version.replace('workspace:', '')
            const workspace = getWorkspaceManifest(name)
            if (!workspace)
              throw new Error(`workspace ${name} not found`)
            return [name, `${prefix}${workspace.manifest.version}`]
          }
          return [name, version]
        })
      )
    }
    packages.forEach(pkg => {
      const { dir, manifest } = workspaces.find(w => (
        w.manifest.name === pkg
        || w.manifest.name.endsWith(`/${pkg}`)
      ))
      console.log(dir)
      const { name, version } = manifest
      const dirName = name
        .replace('@', '+')
        .replace('/', '-')
      if (!fs.existsSync(path.resolve(tempPublishPath, dirName))) {
        fs.mkdirSync(path.resolve(tempPublishPath, dirName))
      }
      cpRecursive(dir, path.resolve(tempPublishPath, dirName), {
        exclude: [
          path.resolve(dir, 'node_modules'),
          path.resolve(dir, 'dist'),
          path.resolve(dir, 'src'),
          path.resolve(dir, 'tests')
        ]
      })
      cpRecursive(path.resolve(dir, './dist'), path.resolve(tempPublishPath, dirName))
      const multipleDependencies = [
        'dependencies',
        'devDependencies',
        'peerDependencies'
      ] as const
      multipleDependencies.forEach(key => {
        if (!manifest[key]) return

        manifest[key] = replaceWorkspaceDependency(manifest[key] ?? {})
      })
      console.log(manifest)
      fs.writeFileSync(
        path.resolve(tempPublishPath, dirName, 'package.json'),
        JSON.stringify(manifest, null, 2)
      )
      // run pnpm publish
      const { status } = child_process.spawnSync('npm', [
        'publish',
        '--tag',
        options.tag ?? 'latest',
        '--dir',
        path.resolve(tempPublishPath, dirName),
        '--access',
        'public'
      ], {
        stdio: 'inherit'
      })
      if (status !== 0) {
        throw new Error(`publish ${name}@${version} failed`)
      }
    })
  })

program.parse(process.argv)

function cpRecursive(src: string, dest: string, opts?: {
  exclude?: string[]
}) {
  const files = fs.readdirSync(src)
  files.forEach(file => {
    const srcPath = path.resolve(src, file)
    if (opts?.exclude?.includes(srcPath)) return

    const destPath = path.resolve(dest, file)
    if (fs.statSync(srcPath).isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath)
      }
      cpRecursive(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  })
}
