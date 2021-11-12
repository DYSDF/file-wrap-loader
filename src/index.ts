import { LoaderContext } from 'webpack'
import { tmpdir } from 'os'
import { resolve, dirname, isAbsolute, relative, extname } from 'path'
import { writeFileSync } from 'fs'
import { getOptions } from 'loader-utils'
import { template } from 'lodash'
import { hash } from './utils'

type LoaderOption = {
  template?: string
}

const RELATIVE_RE = /\.{1,2}\/([^/]+\/)?/g

export default function (
  this: LoaderContext<LoaderOption>,
  content: string | Buffer,
  map: object, meta: any
) {
  this.cacheable()

  const opts = getOptions(this) || {}
  const tpl_str = (opts.template || '<%= source %>') as string
  const compiled = template(tpl_str)

  content = content.toString()
    .split('\n')
    .map(line => line.replace(
      RELATIVE_RE,
      m => {
        const module_path = resolve(dirname(this.resourcePath), m)
        const relative_path = isAbsolute(module_path)
          ? module_path
          : relative(tmpdir(), module_path)
        return relative_path + '/'
      }
    ))
    .join('\n')
  content = compiled({ source: content })

  const file_hash = hash(this.resourcePath)
  const file_ext = extname(this.resourcePath)
  const tmp_file = resolve(tmpdir(), `wrapper_file_${file_hash}${file_ext}`)
  writeFileSync(tmp_file, content)

  return `module.exports = require("${tmp_file}")`
}
