import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v3_4_0 } from './v3_4_0'

export const versionGraph = VersionGraph.of({
  current,
  other: [v3_4_0],
})
