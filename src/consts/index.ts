export const additionalPkgScripts = {
    aliases: 'dev-configs-aliases',
    prepare: 'husky',
    format: 'prettier --write ./src --config',
    lint: 'run-s lint:*',
    'lint:eslint': 'eslint -c ./eslint.config.js .',
    'lint:tsc': 'tsc --p ./tsconfig.json --noEmit true --emitDeclarationOnly false',
    fix: 'npm run lint:eslint -- --fix && npm run lint:tsc',
}

export const pkgName = 'package.json'
export const eslintConfigName = 'eslint.config.js'
export const jestConfigName = 'jest.config.js'
export const tsConfigName = 'tsconfig.json'
export const viteConfigName = 'vite.config.ts'

export const aliasesFile = {
    sourceName: 'aliases.json',
    destName: 'aliases.json',
}
export const editorconfigFile = {
    sourceName: '.editorconfig',
    destName: '.editorconfig',
}
export const gitignoreFile = {
    sourceName: 'gitignore.txt',
    destName: '.gitignore',
}
export const lintStagedConfigFile = {
    sourceName: 'lint-staged.config.js',
    destName: 'lint-staged.config.js',
}

export const destConfigsFiles = [
    eslintConfigName,
    jestConfigName,
    tsConfigName,
    aliasesFile.destName,
    editorconfigFile.destName,
    gitignoreFile.destName,
    lintStagedConfigFile.destName,
]

export const eslintConfigTemplateName = eslintConfigName
export const jestConfigTemplateName = jestConfigName
export const tsConfigTemplateName = 'ts.config.json'

export const distPath = '@form-crafter/dev-configs/dist'
export const distModulePath = `node_modules/${distPath}`
