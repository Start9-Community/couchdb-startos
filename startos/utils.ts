import { sdk } from './sdk'

export const couchdbPort = 5984

export const mounts = sdk.Mounts.of()
  .mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: '/opt/couchdb/data',
    readonly: false,
  })
  .mountVolume({
    volumeId: 'config',
    subpath: null,
    mountpoint: '/opt/couchdb/etc/local.d',
    readonly: false,
  })
