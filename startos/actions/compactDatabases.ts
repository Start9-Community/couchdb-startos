import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { couchdbPort } from '../utils'

export const compactDatabases = sdk.Action.withoutInput(
  'compact-databases',

  async () => ({
    name: i18n('Compact Databases'),
    description: i18n(
      'Reclaim disk space by compacting every database and its indexes. CouchDB keeps old document revisions on disk until compaction runs, so this can free significant space after heavy syncing or a LiveSync cleanup.',
    ),
    warning: i18n(
      'Compaction runs in the background and the service keeps serving requests. Large databases may take several minutes to finish.',
    ),
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const password = await storeJson.read((s) => s.adminPassword).once()
    const base = `http://localhost:${couchdbPort}`
    const headers = {
      Authorization:
        'Basic ' + Buffer.from(`admin:${password}`).toString('base64'),
      'Content-Type': 'application/json',
    }

    const dbsRes = await fetch(`${base}/_all_dbs`, { headers })
    if (!dbsRes.ok) {
      throw new Error(
        i18n('Failed to list databases (HTTP ${status})', {
          status: String(dbsRes.status),
        }),
      )
    }

    const compacted: string[] = []
    const failed: string[] = []
    for (const db of (await dbsRes.json()) as string[]) {
      const encoded = encodeURIComponent(db)
      const res = await fetch(`${base}/${encoded}/_compact`, {
        method: 'POST',
        headers,
      })
      if (!res.ok) {
        failed.push(db)
        continue
      }
      compacted.push(db)

      const ddocsRes = await fetch(`${base}/${encoded}/_design_docs`, {
        headers,
      })
      if (!ddocsRes.ok) continue
      const { rows } = (await ddocsRes.json()) as { rows: { id: string }[] }
      for (const { id } of rows) {
        await fetch(
          `${base}/${encoded}/_compact/${encodeURIComponent(id.replace(/^_design\//, ''))}`,
          { method: 'POST', headers },
        )
      }
    }

    return {
      version: '1',
      title: i18n('Compaction Started'),
      message: i18n(
        'Compaction started for ${count} database(s). Large databases may take a few minutes to finish in the background.',
        { count: String(compacted.length) },
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Databases'),
            description: null,
            value: compacted.join(', ') || '—',
            masked: false,
            copyable: false,
            qr: false,
          },
          ...(failed.length
            ? [
                {
                  type: 'single' as const,
                  name: i18n('Failed to start'),
                  description: null,
                  value: failed.join(', '),
                  masked: false,
                  copyable: false,
                  qr: false,
                },
              ]
            : []),
        ],
      },
    }
  },
)
