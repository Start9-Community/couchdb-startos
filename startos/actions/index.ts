import { sdk } from '../sdk'
import { setAdminPassword } from './setAdminPassword'
import { compactDatabases } from './compactDatabases'

export const actions = sdk.Actions.of()
  .addAction(setAdminPassword)
  .addAction(compactDatabases)
