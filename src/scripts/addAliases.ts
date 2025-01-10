import fs from 'fs/promises'
import ora from 'ora'

import { aliasesConfigName, tsConfigName, viteConfigName } from '_consts'
import { getFile, toJSON } from '_utils'

const getDefaultAliasesConfig = () => ({
    _components: 'components',
    _consts: 'consts',
    _enums: 'enums',
    _hocs: 'hocs',
    _hooks: 'hooks',
    _services: 'services',
    _types: 'types',
    _utils: 'utils',
    _validators: 'validators',
    _relations: 'relations',
    _pages: 'pages',
})

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

    const pathsStr = Object.entries(paths)
        .map(([key, value]) => `${key}: ${value}`)
        .join(',\n      ')

    const aliasPattern = /alias:\s*{[^}]*}/

    if (aliasPattern.test(fileContent)) {
        fileContent = fileContent.replace(aliasPattern, `alias: {\n      ${pathsStr}\n    }`)
    }

    await fs.writeFile(viteConfigName, fileContent)
}

export const addAliases = () =>
    new Promise(async (res, rej) => {
        const spinner = ora('Adding aliases...').start()

        let aliases = await getFile(aliasesConfigName, true)
        if (!aliases) {
            aliases = getDefaultAliasesConfig()
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
