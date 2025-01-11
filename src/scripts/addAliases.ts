import fs from 'fs/promises'
import ora from 'ora'

import { aliasesFile, tsConfigName, viteConfigName } from '_consts'
import { getFile, toJSON } from '_utils'

const tabWidth = '    ' // 4 spaces

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

const addToViteConfig = async (fileContent: string, aliases: Record<string, any>) => {
    const paths = Object.entries(aliases).reduce((result, [alias, path]) => {
        return {
            ...result,
            [alias]: `getAlias('src/${path}')`,
        }
    }, {})

    let pathsStr = Object.entries(paths)
        .map(([key, value]) => `${key}: ${value}`)
        .join(`,\n${tabWidth.repeat(3)}`)
    pathsStr += ','

    const aliasPattern = /alias:\s*{[^}]*}/

    if (aliasPattern.test(fileContent)) {
        fileContent = fileContent.replace(aliasPattern, `alias: {\n${tabWidth.repeat(3)}${pathsStr}\n${tabWidth.repeat(2)}}`)
    }

    await fs.writeFile(viteConfigName, fileContent)
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

        const viteConfig = await getFile(viteConfigName)
        if (!viteConfig) {
            rej(`${viteConfigName} file not found`)
        }

        const tasks: Promise<any>[] = [
            addToTsConfig(tsConfig as Record<string, any>, aliases as Record<string, any>),
            addToViteConfig(viteConfig as string, aliases as Record<string, any>),
        ]

        try {
            await Promise.all(tasks)
            res('Aliases is successfully added')
        } catch (e: any) {
            rej(e?.message || 'Unknown error')
        } finally {
            spinner.stop()
        }
    })
