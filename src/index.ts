import { LoaderContext } from 'webpack'
import { tmpdir } from 'os'
import { resolve, dirname, isAbsolute, relative, extname } from 'path'
import { writeFileSync, realpathSync } from 'fs'
import { getOptions } from 'loader-utils'
import { template } from 'lodash'
import { createHash } from 'crypto'
import matches from './match'

type LoaderOption = {
  template?: string
}

const real_tmp = realpathSync(tmpdir())

export default function (
  this: LoaderContext<LoaderOption>,
  content: string | Buffer,
  map: object, meta: any
) {
  const res_path = this.resourcePath
  const res_ext = extname(res_path)

  if (!matches[res_ext]) return content

  const matcher = matches[res_ext]

  const res_dir = dirname(res_path)

  this.cacheable()

  const loader_opts = getOptions(this) || {}
  const tpl_str = (loader_opts.template || '<%= source %>') as string
  const compiled = template(tpl_str)

  content = content.toString()
  content = content.split('\n').map((part: string) => matcher(part, (match: string): string => {
    const import_path = resolve(res_dir, match)
    return relative(real_tmp, import_path) + '/'
  })).join('\n')

  content = compiled({ source: content })

  const path_hash = createHash('md5').update(res_path).digest('hex')
  const wrap_file = resolve(real_tmp, `wrapper_${path_hash}${res_ext}`)
  writeFileSync(wrap_file, content)
  return `module.exports = require("${wrap_file}")`
}
