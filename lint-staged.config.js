export default {
    '**/*.(ts|tsx)': (filenames) => [`npm run lint:eslint ${filenames.join(' ')}`, 'npm run lint:tsc'],
}
