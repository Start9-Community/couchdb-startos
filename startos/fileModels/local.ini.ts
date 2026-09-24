import { FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const localIni = FileHelper.string({
  base: sdk.volumes.config,
  subpath: 'local.ini',
})

export function withAdmin(ini: string, password: string) {
  let section = ''
  const lines = ini.split('\n').filter((line) => {
    const header = line.match(/^\s*\[([^\]]+)\]/)
    if (header) section = header[1].trim()
    return !(section === 'admins' && /^\s*admin\s*=/.test(line))
  })
  const at = lines.findIndex((l) => /^\s*\[admins\]/.test(l))
  if (at === -1)
    return `${ini.trimEnd()}\n\n[admins]\nadmin = ${password}\n`.trimStart()
  lines.splice(at + 1, 0, `admin = ${password}`)
  return lines.join('\n')
}
