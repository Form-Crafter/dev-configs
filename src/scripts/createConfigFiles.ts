import fs from 'fs/promises'
import ora from 'ora'

import {
    additionalPkgScripts,
    aliasesFile,
    destConfigsFiles,
    distModulePath,
    distPath,
    editorconfigFile,
    eslintConfigName,
    eslintConfigTemplateName,
    gitignoreFile,
    jestConfigName,
    jestConfigTemplateName,
    lintStagedConfigFile,
    pkgName,
    tsConfigName,
    tsConfigTemplateName,
} from '_consts'
import { PackageJson } from '_types'
import { copyFile, createFile, fileIsExists, getFile, toJSON } from '_utils'

const addPackageJsonConfig = async () => {
    const pkg = (await getFile(`./${pkgName}`, true)) as PackageJson

    const resultPkg: PackageJson = {
        ...pkg,
        scripts: {
            ...pkg.scripts,
            ...additionalPkgScripts,
        },
    }

    if (!pkg.prettier) {
        resultPkg.prettier = `${distPath}/prettier.json`
    }

    await fs.writeFile(pkgName, toJSON(resultPkg))
}

export const createConfigFiles = () =>
    new Promise(async (res, rej) => {
        const spinner = ora('Installing packages...').start()

        const destConfigsFilesToCreate = destConfigsFiles.filter((fileName) => !fileIsExists(fileName))

        const tasksOfCreateCongifs: Promise<any>[] = [addPackageJsonConfig()]

        destConfigsFilesToCreate.forEach(async (configFileName) => {
            switch (configFileName) {
                case tsConfigName:
                    const tsConfigData = await getFile(`${distModulePath}/templates/${tsConfigTemplateName}`, true)
                    if (typeof tsConfigData === 'object') {
                        tasksOfCreateCongifs.push(createFile(tsConfigName, toJSON(tsConfigData)))
                    }
                    return
                case eslintConfigName:
                    const eslintConfigData = await getFile(`${distModulePath}/templates/${eslintConfigTemplateName}`)
                    if (typeof eslintConfigData === 'string') {
                        tasksOfCreateCongifs.push(createFile(eslintConfigName, eslintConfigData))
                    }
                    return
                case jestConfigName:
                    const jestConfigData = await getFile(`${distModulePath}/templates/${jestConfigTemplateName}`)
                    if (typeof jestConfigData === 'string') {
                        tasksOfCreateCongifs.push(createFile(jestConfigName, jestConfigData))
                    }
                    return
                case aliasesFile.destName:
                    tasksOfCreateCongifs.push(copyFile(aliasesFile, distModulePath))
                    return
                case editorconfigFile.destName:
                    tasksOfCreateCongifs.push(copyFile(editorconfigFile, distModulePath))
                    return
                case gitignoreFile.destName:
                    tasksOfCreateCongifs.push(copyFile(gitignoreFile, distModulePath))
                    return
                case lintStagedConfigFile.destName:
                    tasksOfCreateCongifs.push(copyFile(lintStagedConfigFile, distModulePath))
                    return
                default:
                    return
            }
        })

        try {
            await Promise.all(tasksOfCreateCongifs)
            res('Configuration files successfully created')
        } catch (e: any) {
            rej(e?.message || 'Unknown error')
        } finally {
            spinner.stop()
        }
    })
