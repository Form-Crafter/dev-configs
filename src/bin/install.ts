#!/usr/bin/env node

import { createConfigFiles } from 'scripts/createConfigFiles'
;(async function main() {
    try {
        console.log(await createConfigFiles())
    } catch (message) {
        console.log(message)
    }
})().catch(console.log)
