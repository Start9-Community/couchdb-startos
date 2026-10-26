import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'couchdb',
  title: 'CouchDB',
  license: 'Apache-2.0',
  packageRepo: 'https://github.com/Start9-Community/couchdb-startos',
  upstreamRepo: 'https://github.com/apache/couchdb',
  marketingUrl: 'https://couchdb.apache.org/',
  donationUrl: 'https://www.apache.org/foundation/contributing.html',
  description: { short, long },
  volumes: ['main', 'config'],
  images: {
    main: {
      // Built from the root Dockerfile, which is the official `couchdb` image with two
      // compromised certificate authorities removed — the upstream tag now lives in its `FROM`
      // line. This is temporary: when Debian ships a fixed ca-certificates, the Dockerfile goes
      // and this becomes `dockerTag: 'couchdb:<tag>'` again. UPDATING.md § The CA override.
      source: { dockerBuild: {} },
      arch: ['x86_64', 'aarch64'],
    },
  },
})
