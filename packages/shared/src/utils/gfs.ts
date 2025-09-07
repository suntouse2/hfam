import 'source-map-support/register'
import chalk from 'chalk'
import ErrorStackParser from 'error-stack-parser'

export function gfs(err: Error) {
	try {
		const frames = ErrorStackParser.parse(err)
		if (!frames.length) return null

		return frames.map(f => {
			const fn = f.functionName ? chalk.cyan(f.functionName) : chalk.dim('<anon>')
			const file = f.fileName ? chalk.gray(f.fileName) : chalk.red('unknown')
			const line = f.lineNumber ?? '?'
			const col = f.columnNumber ?? '?'

			return `${fn} ${file}:${line}:${col}`
		})
	} catch {
		return null
	}
}
