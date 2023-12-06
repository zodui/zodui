export default function () {
  const cwd = process.cwd()
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkg = require(`${cwd}/package.json`)
  const { dependencies = {}, peerDependencies = {} } = pkg
  const external = <(string | RegExp)[]>Object
    .keys(dependencies)
    .concat(Object.keys(peerDependencies))
  return external
    .map(dep => new RegExp(`^${dep}(/.*)?$`))
}
