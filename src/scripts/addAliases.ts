import fs from 'fs/promises'
import ora from 'ora'

import { aliasesFile, tsConfigName } from '_consts'
import { getFile, toJSON } from '_utils'

const addToTsConfig = async (fileContent: Record<string, any>, aliases: Record<string, any>) => {
    const paths = Object.entries(aliases).reduce((result, [alias, path]) => {
        return {
            ...result,
            [alias]: [path],
            [`${alias}/*`]: [`${path}/*`],
        }
    }, {})

    const result = {
        ...fileContent,
        compilerOptions: {
            ...(fileContent.compilerOptions || null),
            paths,
        },
    }

    await fs.writeFile(tsConfigName, toJSON(result))
}

export const addAliases = () =>
    new Promise(async (res, rej) => {
        const spinner = ora('Adding aliases...').start()

        const aliases = await getFile(aliasesFile.destName, true)
        if (!aliases) {
            rej(`${aliasesFile.destName} file not found`)
        }

        const tsConfig = await getFile(tsConfigName, true)
        if (!tsConfig) {
            rej(`${tsConfigName} file not found`)
        }

        const tasks: Promise<any>[] = [addToTsConfig(tsConfig as Record<string, any>, aliases as Record<string, any>)]

        try {
            await Promise.all(tasks)
            res('Aliases is successfully added')
        } catch (e: any) {
            rej(e?.message || 'Unknown error')
        } finally {
            spinner.stop()
        }
    })
