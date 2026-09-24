# CouchDB

## Documentation

- [Apache CouchDB documentation](https://docs.couchdb.org/en/stable/*) — the upstream reference: Fauxton, configuration, replication and the HTTP API.
- [LiveSync quick setup](https://github.com/vrtmrz/obsidian-livesync/blob/main/docs/quick_setup.md) — connecting the Obsidian plugin to a CouchDB server.
- [LiveSync settings](https://github.com/vrtmrz/obsidian-livesync/blob/main/docs/settings.md) — what each plugin setting does.
- [LiveSync troubleshooting](https://github.com/vrtmrz/obsidian-livesync/blob/main/docs/troubleshooting.md) — fixing sync and connection problems.

## What you get on StartOS

A private CouchDB server that Obsidian's **Self-hosted LiveSync** plugin syncs your vaults through. It is already configured for LiveSync — login required, the Obsidian apps allowed to connect, and large notes and attachments accepted — so there is nothing to set up inside CouchDB itself.

It has two interfaces:

- **CouchDB API** — the address you give LiveSync.
- **Fauxton UI** — CouchDB's web admin, for browsing databases and documents.

## Getting set up

1. Run the **Set Admin Password** task. Copy the password it shows and keep it somewhere safe — it is shown only once. The username is always `admin`.
2. Start the service.
3. In Obsidian, install and enable the **Self-hosted LiveSync** community plugin, then open its setup and choose to connect to CouchDB.
4. Enter:
   - **URI**: an address from the **CouchDB API** interface.
   - **Username**: `admin`
   - **Password**: the password from step 1.
   - **Database name**: any name, for example `obsidian`. LiveSync creates it the first time it connects.
5. Test the connection, then turn on sync. Repeat steps 3–5 on each device, using the same database name.

## Using CouchDB

### Fauxton UI

Opening the Fauxton UI asks for a username and password first — use `admin` and your admin password. From there you can see each database LiveSync has created, how large it is, and its documents.

### Actions

- **Set Admin Password** — replaces the admin password with a new one. Run it if the password has been exposed or lost. The service needs to be stopped first. Afterwards, update the password in LiveSync on every device.
- **Compact Databases** — frees disk space. CouchDB keeps old versions of every note until it compacts, and LiveSync saves a new version on every edit, so the database grows over time. Run this now and then, and especially after a LiveSync cleanup or rebuild. It works in the background while the service keeps running, and large databases can take a few minutes to shrink.

## Limitations

- Restoring a backup brings back the admin password that was in use when the backup was taken. If you changed it since, update LiveSync on each device or run **Set Admin Password** again.
