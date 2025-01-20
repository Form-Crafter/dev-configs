#!/usr/bin/env node

import chalk from 'chalk'
import { createConfigFiles } from 'scripts/create-config-files'
;(async function main() {
    try {
        console.log(chalk.green(await createConfigFiles()))
    } catch (message) {
        console.log(chalk.red(message))
    }
})().catch((e) => console.log(chalk.red(e)))
