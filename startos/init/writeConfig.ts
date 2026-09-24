import { startosIni, startosIniContent } from '../fileModels/startos.ini'
import { sdk } from '../sdk'

export const writeConfig = sdk.setupOnInit(async (effects) => {
  await startosIni.write(effects, startosIniContent)
})
