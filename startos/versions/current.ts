import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '3.5.3:2',
  releaseNotes: {
    en_US:
      "- Removes two certificate authorities from the image's trust store. eMudhra's signing keys were compromised and the authorities were withdrawn, but the base image still trusted them; CouchDB checks remote replication targets against this store when certificate verification is switched on.\n- Packaging update, with no change to CouchDB itself: moves to StartOS SDK 3.1.0.",
    es_ES:
      '- Elimina dos autoridades de certificación del almacén de confianza de la imagen. Las claves de firma de eMudhra se vieron comprometidas y las autoridades fueron retiradas, pero la imagen base seguía confiando en ellas; CouchDB verifica los destinos de replicación remotos con este almacén cuando la verificación de certificados está activada.\n- Actualización de empaquetado, sin cambios en CouchDB: pasa al SDK 3.1.0 de StartOS.',
    de_DE:
      '- Entfernt zwei Zertifizierungsstellen aus dem Vertrauensspeicher des Images. Die Signierschlüssel von eMudhra wurden kompromittiert und die Stellen zurückgezogen, doch das Basis-Image vertraute ihnen weiterhin; CouchDB prüft entfernte Replikationsziele gegen diesen Speicher, wenn die Zertifikatsprüfung eingeschaltet ist.\n- Paketierungs-Update ohne Änderung an CouchDB selbst: Wechsel auf StartOS SDK 3.1.0.',
    pl_PL:
      '- Usuwa dwa urzędy certyfikacji z magazynu zaufania obrazu. Klucze podpisujące eMudhra zostały skompromitowane, a urzędy wycofane, lecz obraz bazowy nadal im ufał; CouchDB weryfikuje zdalne cele replikacji wobec tego magazynu, gdy weryfikacja certyfikatów jest włączona.\n- Aktualizacja pakietu, bez zmian w samym CouchDB: przejście na StartOS SDK 3.1.0.',
    fr_FR:
      '- Retire deux autorités de certification du magasin de confiance de l’image. Les clés de signature d’eMudhra ont été compromises et les autorités retirées, mais l’image de base leur faisait toujours confiance ; CouchDB vérifie les cibles de réplication distantes avec ce magasin lorsque la vérification des certificats est activée.\n- Mise à jour d’empaquetage, sans changement de CouchDB : passage au SDK StartOS 3.1.0.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
