#!/usr/bin/env node

import { createConfigFiles } from '_bin/createConfigFiles'
import { installPackages } from '_bin/installPackages'
;(async function main() {
    try {
        console.log(await installPackages())
        console.log(await createConfigFiles())
    } catch (message) {
        console.log(message)
    }
})().catch(console.log)
