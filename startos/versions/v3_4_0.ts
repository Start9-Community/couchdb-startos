import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

// Retired current version. Kept in the graph so installs still on this version
// have a migration path forward. Note the version string says 3.4.0 while the
// image it shipped was couchdb:3.4.3 — the upstream portion was never bumped
// past the initial packaging. Corrected from 3.5.2:0 onward.
export const v3_4_0 = VersionInfo.of({
  version: '3.4.0:10',
  releaseNotes: {
    en_US:
      'Internal cleanup: credential surfacing is now owned solely by the install step (removed a redundant code path and its coordinating store flag). No user-facing change. Includes: live Reset Password with no downtime, notifications for password changes and first start, and the "Compact Databases" action.',
  },
  migrations: {
    // Password generation and config writing are handled by main() on first
    // run (single source of truth), so no install-time migration is required.
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
