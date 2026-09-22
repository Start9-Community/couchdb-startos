import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.5.2:0',
  releaseNotes: {
    en_US:
      'Updates CouchDB from 3.4.3 to 3.5.2. Upstream adds parallel file reads (15-30% better read throughput), an optimized replicator, and the Jiffy 2.0 JSON library — all of which help the read- and replication-heavy workload Obsidian LiveSync generates. The image is the 3.5.2.1 build, which is 3.5.2 on an updated Erlang/OTP. No configuration changes are needed and your existing databases and admin password carry over.',
  },
  migrations: {
    // No data migration. CouchDB upgrades its own on-disk format in place:
    // shard files gain xxHash checksums and the admin password hash in
    // local.ini is re-hashed on first auth (upgrade_hash_on_auth defaults to
    // true as of 3.5.0). Both are applied lazily by the server itself.
    up: async () => {},
    // Downgrade is permitted: upstream documents both the xxHash checksums and
    // the upgraded password hash as readable by 3.4.1-3.4.3, which is the range
    // the previous version shipped. v3_4_0 still blocks going back any further.
    down: async () => {},
  },
})
