import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.5.3:2',
  releaseNotes: {
    en_US:
      '- Rebuild on the refreshed CouchDB 3.5.3 image, which picks up the latest Debian security updates. CouchDB itself is unchanged.',
    es_ES:
      '- Reconstrucción sobre la imagen actualizada de CouchDB 3.5.3, que incorpora las últimas actualizaciones de seguridad de Debian. CouchDB en sí no cambia.',
    de_DE:
      '- Neubau auf dem aktualisierten CouchDB-3.5.3-Image, das die neuesten Debian-Sicherheitsupdates enthält. CouchDB selbst bleibt unverändert.',
    pl_PL:
      '- Przebudowa na odświeżonym obrazie CouchDB 3.5.3, który zawiera najnowsze aktualizacje bezpieczeństwa Debiana. Sam CouchDB pozostaje bez zmian.',
    fr_FR:
      '- Reconstruction sur l’image CouchDB 3.5.3 rafraîchie, qui intègre les dernières mises à jour de sécurité de Debian. CouchDB lui-même est inchangé.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
