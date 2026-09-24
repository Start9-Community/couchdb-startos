export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting CouchDB...': 0,
  CouchDB: 1,
  'CouchDB is accepting connections': 2,
  'CouchDB is not responding': 3,

  // interfaces.ts
  'CouchDB API': 4,
  'The CouchDB HTTP API for Obsidian LiveSync': 5,
  'Fauxton UI': 6,
  'CouchDB web administration interface': 7,

  // actions/setAdminPassword.ts
  'Set Admin Password': 8,
  'Generate a new random password for the CouchDB admin account. Replaces any existing password.': 9,
  'Replaces the current admin password. Every Obsidian LiveSync client must be updated with the new one.': 10,
  'CouchDB Admin Credentials': 11,
  'Use these credentials in Obsidian LiveSync and to sign in to Fauxton.': 12,
  Username: 13,
  Password: 14,

  // init/watchCredentials.ts
  'Set the CouchDB admin password': 15,

  // actions/compactDatabases.ts
  'Compact Databases': 16,
  'Reclaim disk space by compacting every database and its indexes. CouchDB keeps old document revisions on disk until compaction runs, so this can free significant space after heavy syncing or a LiveSync cleanup.': 17,
  'Compaction runs in the background and the service keeps serving requests. Large databases may take several minutes to finish.': 18,
  'Failed to list databases (HTTP ${status})': 19,
  'Compaction Started': 20,
  'Compaction started for ${count} database(s). Large databases may take a few minutes to finish in the background.': 21,
  Databases: 22,
  'Failed to start': 23,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
