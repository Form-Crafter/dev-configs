import ora from 'ora'

import { copyFile, createFile, fileIsExists, getFile } from '_utils'

const eslintConfigName = 'eslint.config.js'
const jestConfigName = 'jest.config.js'
const tsConfigName = 'tsconfig.json'
const editorconfigName = '.editorconfig'
const gitignoreName = '.gitignore'
const lintStagedConfigName = 'lint-staged.config.js'

const configsFiles = [eslintConfigName, jestConfigName, tsConfigName, editorconfigName, gitignoreName, lintStagedConfigName]

const eslintConfigTemplateName = eslintConfigName
const jestConfigTemplateName = jestConfigName
const tsConfigTemplateName = 'ts.config.json'

const distPath = 'node_modules/@form-crafter/dev-configs/dist'

export const createConfigFiles = () =>
    new Promise(async (res, rej) => {
        const spinner = ora('Installing packages...').start()

        const configsFilesToCreate = configsFiles.filter(fileIsExists)

        const tasksOfCreateFiles: Promise<any>[] = []

        configsFilesToCreate.forEach(async (configFileName) => {
            switch (configFileName) {
                case eslintConfigName:
                    const eslintConfigData = await getFile(`${distPath}/templates/${eslintConfigTemplateName}`)
                    if (typeof eslintConfigData === 'string') {
                        tasksOfCreateFiles.push(createFile(eslintConfigName, eslintConfigData))
                    }
                    return
                case jestConfigName:
                    const jestConfigData = await getFile(`${distPath}/templates/${jestConfigTemplateName}`)
                    if (typeof jestConfigData === 'string') {
                        tasksOfCreateFiles.push(createFile(jestConfigName, jestConfigData))
                    }
                    return
                case tsConfigName:
                    const tsConfigData = await getFile(`${distPath}/templates/${tsConfigTemplateName}`, true)
                    if (typeof tsConfigData === 'object') {
                        tasksOfCreateFiles.push(createFile(tsConfigName, JSON.stringify(tsConfigData, null, 4)))
                    }
                    return
                case editorconfigName:
                    tasksOfCreateFiles.push(copyFile(editorconfigName, distPath))
                    return
                case gitignoreName:
                    tasksOfCreateFiles.push(copyFile(gitignoreName, distPath))
                    return
                case lintStagedConfigName:
                    tasksOfCreateFiles.push(copyFile(lintStagedConfigName, distPath))
                    return
                default:
                    return
            }
        })

        try {
            await Promise.all(tasksOfCreateFiles)
            res('Configuration files successfully created')
        } catch (e: any) {
            rej(e?.message || 'Unknown error')
        } finally {
            spinner.stop()
        }
    })
