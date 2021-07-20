import { readFileSync } from 'fs'
import { Icns } from '@fiahfy/icns'
import { IcnsImage } from '@fiahfy/icns'

export const createImage = (buffer: Buffer): string=> {
  const b64 = buffer.toString("base64")
  return `data:image/png;base64, ${ b64 }`
}

export interface icnsApp {
  images: ReadonlyArray<IcnsImage>
  toImage(buffer: Buffer): string
}

export const readIcns = (file: string): icnsApp | undefined=> {
  try {
    const buf = readFileSync(file)
    const icns = Icns.from(buf)
    let images = icns.images
    images = images.filter(item=> item.osType.indexOf("ic") >= 0)
    return {
      images,
      toImage(buffer) {
        return createImage(buffer)
      }
    }
  } catch (error) {
    console.error(error)
  }
  
}