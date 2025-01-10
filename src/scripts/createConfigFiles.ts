import fs from 'fs/promises'
import ora from 'ora'

import {
    additionalPkgScripts,
    configsFiles,
    distPath,
    editorconfigName,
    eslintConfigName,
    eslintConfigTemplateName,
    gitignoreName,
    jestConfigName,
    jestConfigTemplateName,
    lintStagedConfigName,
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
        resultPkg.prettier = '@form-crafter/dev-configs/dist/.prettierrc'
    }

    await fs.writeFile(pkgName, toJSON(resultPkg))
}

export const createConfigFiles = () =>
    new Promise(async (res, rej) => {
        const spinner = ora('Installing packages...').start()

        const configsFilesToCreate = configsFiles.filter((fileName) => !fileIsExists(fileName))

        const tasksOfCreateCongifs: Promise<any>[] = [addPackageJsonConfig()]

        configsFilesToCreate.forEach(async (configFileName) => {
            switch (configFileName) {
                case eslintConfigName:
                    const eslintConfigData = await getFile(`${distPath}/templates/${eslintConfigTemplateName}`)
                    if (typeof eslintConfigData === 'string') {
                        tasksOfCreateCongifs.push(createFile(eslintConfigName, eslintConfigData))
                    }
                    return
                case jestConfigName:
                    const jestConfigData = await getFile(`${distPath}/templates/${jestConfigTemplateName}`)
                    if (typeof jestConfigData === 'string') {
                        tasksOfCreateCongifs.push(createFile(jestConfigName, jestConfigData))
                    }
                    return
                case tsConfigName:
                    const tsConfigData = await getFile(`${distPath}/templates/${tsConfigTemplateName}`, true)
                    if (typeof tsConfigData === 'object') {
                        tasksOfCreateCongifs.push(createFile(tsConfigName, toJSON(tsConfigData)))
                    }
                    return
                case editorconfigName:
                    tasksOfCreateCongifs.push(copyFile(editorconfigName, distPath))
                    return
                case gitignoreName:
                    tasksOfCreateCongifs.push(copyFile(gitignoreName, distPath))
                    return
                case lintStagedConfigName:
                    tasksOfCreateCongifs.push(copyFile(lintStagedConfigName, distPath))
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
