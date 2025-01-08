import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'

export const getFile = async (fileName: string, isJson = false) => {
    const pathName = path.resolve(fileName)

    if (fs.existsSync(pathName)) {
        const data = fs.readFileSync(pathName)
        return isJson ? JSON.parse(data.toString('utf-8')) : data.toString()
    }

    return undefined
}

export const copyFile = async (name: string, dirPath: string, prepareOut: (data: any) => Parameters<typeof fs.writeFile>['1'] = (data) => data) => {
    const fileData = await getFile(`${dirPath}/${name}`)
    await fsPromises.writeFile(path.resolve(name), prepareOut(fileData))
}

export const createFile = async (name: string, data: string) => {
    await fsPromises.writeFile(path.resolve(name), data)
}
