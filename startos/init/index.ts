import { sdk } from '../sdk'
import { dependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { writeConfig } from './writeConfig'
import { watchCredentials } from './watchCredentials'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  writeConfig,
  setInterfaces,
  actions,
  dependencies,
  watchCredentials,
)

export const uninit = sdk.setupUninit(versionGraph)
