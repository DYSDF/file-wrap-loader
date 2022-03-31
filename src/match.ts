const styleMatcher = (str: string, handler: (arg0: string) => string): string => {
  // @import
  str = str.replace(
    /(@import\s+["'])(\.{1,2}\/([^/]+\/)?)/g,
    (match: string, prefix: string, path) => prefix + handler(path)
  )

  // url()
  str = str.replace(
    /(url\(["'])(\.{1,2}\/([^/]+\/)?)/g,
    (match: string, prefix: string, path: string) => prefix + handler(path)
  )

  return str
}

const javascriptMatcher = (str: string, handler: (arg0: string) => string): string => {
  // import or require
  str = str.replace(
    /((import\s+|require\()["'])(\.{1,2}\/([^/]+\/)?)/g,
    (match: string, prefix: string, _blank: string, path: string) => prefix + handler(path)
  )

  return str
}

export default {
  '.css': styleMatcher,
  '.less': styleMatcher,
  '.scss': styleMatcher,
  '.sass': styleMatcher,
  '.js': javascriptMatcher,
  '.ts': javascriptMatcher
} as Record<string, (arg0: string, arg1: (arg0: string) => string) => string>
