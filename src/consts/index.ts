export const additionalPkgScripts = {
    aliases: 'dev-configs-aliases',
    prepare: 'husky',
    format: 'prettier --write ./src --config',
    lint: 'run-s lint:*',
    'lint:eslint': 'eslint -c ./eslint.config.js .',
    'lint:tsc': 'tsc --p ./tsconfig.json --noEmit true --emitDeclarationOnly false',
    fix: 'npm run lint:eslint -- --fix && npm run lint:tsc',
}

export const aliasesConfigName = 'aliases.json'
export const pkgName = 'package.json'
export const eslintConfigName = 'eslint.config.js'
export const jestConfigName = 'jest.config.js'
export const tsConfigName = 'tsconfig.json'
export const viteConfigName = 'vite.config.ts'
export const editorconfigName = '.editorconfig'
export const gitignoreName = '.gitignore'
export const lintStagedConfigName = 'lint-staged.config.js'

export const configsFiles = [eslintConfigName, jestConfigName, tsConfigName, editorconfigName, gitignoreName, lintStagedConfigName]

export const eslintConfigTemplateName = eslintConfigName
export const jestConfigTemplateName = jestConfigName
export const tsConfigTemplateName = 'ts.config.json'

export const distPath = 'node_modules/@form-crafter/dev-configs/dist'
