import chalk from 'chalk'
import { exec } from 'child_process'
import ora from 'ora'

import { packages } from '_consts'

export const installPackages = () =>
    new Promise((res, rej) => {
        const devPackagesStr = packages.dev.join(' ')

        const spinner = ora('Installing packages...').start()

        const installProcess = exec(`npm i ${devPackagesStr} -D`)

        installProcess.stderr?.on('data', (data) => {
            spinner.stop()
            rej(chalk.red(data))
        })

        installProcess.on('close', (code) => {
            spinner.stop()
            if (code === 0) {
                res(chalk.green('Packages successfully installed!'))
            } else {
                rej(chalk.red(`Process exited with code ${code}`))
            }
        })

        installProcess.on('error', (err) => {
            spinner.stop()
            rej(chalk.red(`Error running process: ${err.message}`))
        })
    })
