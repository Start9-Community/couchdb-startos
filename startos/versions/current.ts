import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.5.2:1',
  releaseNotes: {
    en_US:
      '- Compact Databases asks for confirmation with a warning that it permanently discards the stored contents of old document revisions.',
    es_ES:
      '- Compactar bases de datos pide confirmación con una advertencia de que descarta de forma permanente el contenido almacenado de las revisiones antiguas de los documentos.',
    de_DE:
      '- Datenbanken komprimieren fragt mit dem Hinweis nach Bestätigung, dass die gespeicherten Inhalte alter Dokumentrevisionen dauerhaft verworfen werden.',
    pl_PL:
      '- Kompaktuj bazy danych prosi o potwierdzenie z ostrzeżeniem, że trwale usuwa zapisaną zawartość starych rewizji dokumentów.',
    fr_FR:
      "- Compacter les bases de données demande une confirmation en avertissant qu'il supprime définitivement le contenu stocké des anciennes révisions des documents.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
