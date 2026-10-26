import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.5.3:1',
  releaseNotes: {
    en_US:
      '- Packaging update, with no change to CouchDB itself: moves to StartOS SDK 3.1.0, which carries a fixed version of a validation library this package builds against.',
    es_ES:
      '- Actualización de empaquetado, sin cambios en CouchDB: pasa al SDK 3.1.0 de StartOS, que incluye una versión corregida de una biblioteca de validación con la que se compila este paquete.',
    de_DE:
      '- Paketierungs-Update ohne Änderung an CouchDB selbst: Wechsel auf StartOS SDK 3.1.0, das eine korrigierte Version einer Validierungsbibliothek enthält, gegen die dieses Paket gebaut wird.',
    pl_PL:
      '- Aktualizacja pakietu, bez zmian w samym CouchDB: przejście na StartOS SDK 3.1.0, który zawiera poprawioną wersję biblioteki walidacyjnej używanej do budowania tego pakietu.',
    fr_FR:
      '- Mise à jour d’empaquetage, sans changement de CouchDB : passage au SDK StartOS 3.1.0, qui embarque une version corrigée d’une bibliothèque de validation utilisée pour construire ce paquet.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
