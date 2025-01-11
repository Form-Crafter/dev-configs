import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'

export const toJSON = (data: any) => JSON.stringify(data, null, 2)

export const fileIsExists = (filePath: string) => {
    const pathName = path.resolve(filePath)
    return fs.existsSync(pathName)
}

export const getFile = async (filePath: string, isJson = false): Promise<string | Record<string, any> | undefined> => {
    const pathName = path.resolve(filePath)

    if (fs.existsSync(pathName)) {
        const data = fs.readFileSync(pathName)
        return isJson ? (JSON.parse(data.toString('utf-8')) as Record<string, any>) : data.toString()
    }

    return undefined
}

export const copyFile = async (
    { destName, sourceName = destName }: { destName: string; sourceName?: string },
    dirPath: string,
    prepareOut: (data: any) => Parameters<typeof fs.writeFile>['1'] = (data) => data,
) => {
    const fileData = await getFile(`${dirPath}/${sourceName}`)
    await fsPromises.writeFile(path.resolve(destName), prepareOut(fileData))
}

export const createFile = async (name: string, data: string) => {
    await fsPromises.writeFile(path.resolve(name), data)
}

export const isObject = (data: any): data is Record<string, any> => data !== null && typeof data === 'object'
