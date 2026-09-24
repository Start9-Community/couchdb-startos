import { i18n } from './i18n'
import { sdk } from './sdk'
import { couchdbPort, mounts } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting CouchDB...'))

  return sdk.Daemons.of(effects).addDaemon('couchdb', {
    subcontainer: sdk.SubContainer.of(
      effects,
      { imageId: 'main' },
      mounts,
      'couchdb',
    ),
    exec: { command: sdk.useEntrypoint() },
    ready: {
      display: i18n('CouchDB'),
      fn: () =>
        sdk.healthCheck.checkWebUrl(
          effects,
          `http://localhost:${couchdbPort}/_up`,
          {
            successMessage: i18n('CouchDB is accepting connections'),
            errorMessage: i18n('CouchDB is not responding'),
          },
        ),
    },
    requires: [],
  })
})
