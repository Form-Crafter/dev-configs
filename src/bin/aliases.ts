#!/usr/bin/env node

import chalk from 'chalk'
import { addAliases } from 'scripts/addAliases'
;(async function main() {
    try {
        console.log(chalk.green(await addAliases()))
    } catch (message) {
        console.log(chalk.red(message))
    }
})().catch((e) => console.log(chalk.red(e)))
