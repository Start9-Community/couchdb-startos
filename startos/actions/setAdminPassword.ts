import { utils } from '@start9labs/start-sdk'
import { localIni, withAdmin } from '../fileModels/local.ini'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const setAdminPassword = sdk.Action.withoutInput(
  'set-admin-password',

  async ({ effects }) => ({
    name: i18n('Set Admin Password'),
    description: i18n(
      'Generate a new random password for the CouchDB admin account. Replaces any existing password.',
    ),
    warning: (await storeJson.read((s) => s.adminPassword).const(effects))
      ? i18n(
          'Replaces the current admin password. Every Obsidian LiveSync client must be updated with the new one.',
        )
      : null,
    allowedStatuses: 'only-stopped',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const adminPassword = utils.getDefaultString({
      charset: 'a-z,A-Z,0-9',
      len: 32,
    })
    await localIni.write(
      effects,
      withAdmin((await localIni.read().once()) ?? '', adminPassword),
    )
    await storeJson.merge(effects, { adminPassword })

    return {
      version: '1',
      title: i18n('CouchDB Admin Credentials'),
      message: i18n(
        'Use these credentials in Obsidian LiveSync and to sign in to Fauxton.',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: 'admin',
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: adminPassword,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
