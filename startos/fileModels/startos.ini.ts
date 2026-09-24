import { FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// Sorts before local.ini, the last file in CouchDB's config chain and the one it writes runtime changes to.
export const startosIni = FileHelper.string({
  base: sdk.volumes.config,
  subpath: '00-startos.ini',
})

export const startosIniContent = `[couchdb]
single_node = true
max_document_size = 50000000

[cluster]
n = 1

[chttpd]
port = 5984
bind_address = 0.0.0.0
require_valid_user = true
require_valid_user_except_for_up = true
enable_cors = true
max_http_request_size = 4294967296

[httpd]
WWW-Authenticate = Basic realm="couchdb"

[cors]
credentials = true
headers = accept, authorization, content-type, origin, referer
methods = GET, PUT, POST, HEAD, DELETE
origins = app://obsidian.md, capacitor://localhost, http://localhost
`
