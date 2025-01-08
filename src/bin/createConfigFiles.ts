import ora from 'ora'

import { copyFile, createFile } from '_utils'

const distPath = 'node_modules/@form-crafter/dev-configs/dist'

const eslintConfigData = `
import eslintConfig from '@form-builder/dev-configs/dist/eslint/index.js';

export default [
    ...eslintConfig,
];
`

const jestConfigData = `
import jestConfig from '@form-crafter/dev-configs/dist/jest/index.js';

export default {
    ...jestConfig,
};
`

const tsConfigData = `
{
  "extends": "@form-crafter/dev-configs/dist/tsconfig.json",
}
`

export const createConfigFiles = () =>
    new Promise(async (res, rej) => {
        const spinner = ora('Installing packages...').start()

        try {
            await Promise.all([
                copyFile('.editorconfig', distPath),
                copyFile('.gitignore', distPath),
                copyFile('lint-staged.config.js', distPath),
                createFile('eslint.config.js', eslintConfigData),
                createFile('jest.config.js', jestConfigData),
                createFile('tsconfig.json', tsConfigData),
            ])
            res('Configuration files successfully created')
        } catch (e) {
            rej(e || 'Unknown error')
        } finally {
            spinner.stop()
        }
    })
