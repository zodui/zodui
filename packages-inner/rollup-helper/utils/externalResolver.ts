export default function () {
  const cwd = process.cwd()
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkg = require(`${cwd}/package.json`)
  const { dependencies = {} } = pkg
  const external = Object.keys(dependencies) as (string | RegExp)[]
  return external.concat(/@zodui\/core\/.*/)
}
