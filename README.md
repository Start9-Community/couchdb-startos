<p align="center">
  <img src="icon.svg" alt="CouchDB Logo" width="21%">
</p>

# CouchDB on StartOS

> Everything not listed in this document should behave the same as upstream
> Apache CouchDB. If a feature, setting, or behavior is not mentioned here,
> the upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Apache CouchDB](https://github.com/apache/couchdb) is a document database with an HTTP API and built-in replication. This package runs it as a single node configured for the Obsidian Self-hosted LiveSync plugin: authentication required on every request, CORS open to the Obsidian desktop and mobile apps, and request and document size limits raised for vault sync.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

The package runs the unmodified Docker official image with its own entrypoint, in a single subcontainer.

| Property      | Value                                                                              |
| ------------- | ---------------------------------------------------------------------------------- |
| Image         | `couchdb` (Docker official image), unmodified                                      |
| Architectures | x86_64, aarch64                                                                    |
| Entrypoint    | Upstream `docker-entrypoint.sh`, which fixes ownership and drops to `couchdb`      |
| Subcontainer  | `couchdb` — the CouchDB server                                                     |

The entrypoint refuses to start CouchDB when no admin is configured, so the service cannot start until the admin password has been set (see [Tasks](#tasks)).

## Volume and Data Layout

Two volumes: one for CouchDB's databases, one for its configuration overrides.

| Volume   | Mount point                | Contents                                                                  |
| -------- | -------------------------- | ------------------------------------------------------------------------- |
| `main`   | `/opt/couchdb/data`        | Database and shard files, plus the package's `store.json`                 |
| `config` | `/opt/couchdb/etc/local.d` | `00-startos.ini`, `local.ini`, and the empty `docker.ini` the entrypoint touches |

Databases are CouchDB's own append-only files; there is no external database.

## File Models

The package owns one configuration file outright, shares another with CouchDB, and keeps a small store of its own. CouchDB reads every `.ini` in `local.d` in name order, later files overriding earlier ones, and writes any runtime configuration change to the last one.

| File                            | Owner             | Written                                                                 |
| ------------------------------- | ----------------- | ----------------------------------------------------------------------- |
| `config/00-startos.ini`         | Package           | Rewritten in full on every init (install, update, restore, container rebuild) |
| `config/local.ini`              | CouchDB, shared   | Package sets `[admins] admin` from **Set Admin Password**; CouchDB writes everything else |
| `main/store.json`               | Package           | `adminPassword`, written by **Set Admin Password**                       |

- **`00-startos.ini`** sets single-node mode (`[couchdb] single_node`, `[cluster] n = 1`), the listener on port 5984, `require_valid_user` with `/_up` exempt, CORS for `app://obsidian.md`, `capacitor://localhost` and `http://localhost`, a basic-auth browser prompt, a 50 MB document limit and a 4 GB request limit. A hand edit here is lost at the next init. To override one of these keys, set it through Fauxton's configuration page or the `_config` API — CouchDB writes that to `local.ini`, which loads later and wins.
- **`local.ini`** is where CouchDB persists the hashed admin password, the server `uuid`, the cookie-auth `secret`, and any change made through Fauxton or the `_config` API. Those survive restarts and updates. The package writes only the plaintext admin password, which CouchDB replaces with a PBKDF2 hash on its next start.
- **`store.json`** holds the admin password in plaintext so the **Compact Databases** action can authenticate. It is not upstream configuration.

No environment variables are set; `COUCHDB_USER` / `COUCHDB_PASSWORD` are deliberately unused, since the entrypoint applies them only when no admin exists yet.

## Dependencies

None.

## Network Access and Interfaces

Both interfaces are served by the same CouchDB listener on port 5984 over HTTP, and share one set of addresses.

| Interface   | ID    | Type | Port | Path      | Purpose                                                  |
| ----------- | ----- | ---- | ---- | --------- | -------------------------------------------------------- |
| CouchDB API | `api` | api  | 5984 | `/`       | The HTTP API LiveSync (or any CouchDB client) syncs against |
| Fauxton UI  | `ui`  | ui   | 5984 | `/_utils` | CouchDB's built-in web admin                             |

Every request except `GET /_up` requires authentication. An unauthenticated browser request gets a basic-auth prompt.

## Installation and First-Run Flow

Install creates no credentials and cannot start the service on its own.

1. Install writes `00-startos.ini` and raises the critical **Set Admin Password** task; the service stays stopped.
2. Running the task's action generates the admin password, writes it to `local.ini` and `store.json`, and returns username `admin` and the password. The task clears.
3. On the first start CouchDB hashes the password in place, creates its system databases (`_users`, `_replicator`) and writes its `uuid`. A single `_users database does not exist` error appears in the log during this first start and is harmless.

The package creates no LiveSync database. The LiveSync plugin creates the one named in its settings on first connection.

## Actions

Two user-facing actions; there are no hidden actions.

- **Set Admin Password** (`set-admin-password`) — run on first install (as the critical task) and whenever the admin password must change. Only available while the service is stopped. It generates a new 32-character password, writes it to `local.ini` and `store.json`, and returns it once; the password is not retrievable afterwards except by running the action again. Every LiveSync client must then use the new password: the old one is rejected as soon as the service starts. Safe to repeat — each run simply replaces the password. The `uuid`, cookie secret and all databases are untouched.
- **Compact Databases** (`compact-databases`) — run after heavy syncing or after a LiveSync cleanup/rebuild, when disk usage is high. Only available while running. It triggers compaction of every database, system databases included, and every design document's view index, then returns the list of databases it started. Compaction runs in the background inside CouchDB and continues after the action returns; large databases can take minutes. Service keeps serving throughout. Safe to repeat.

## Tasks

The package raises one task.

- **Set Admin Password** — `critical`. Raised on any init while `store.json` has no admin password: a fresh install, or a store that has been lost. It blocks the service from starting. Running **Set Admin Password** clears it; it does not return once a password is stored.

## Health Checks

One check, on the `couchdb` daemon.

| Check     | Probes                                  | Failure means                                                                 |
| --------- | --------------------------------------- | ----------------------------------------------------------------------------- |
| `couchdb` | `GET http://localhost:5984/_up` inside the container | CouchDB is not serving HTTP. Connection-refused errors in the log during the first few seconds after a start are normal. If it persists, read the log: the entrypoint exits with an "Admin Party" error when `local.ini` has lost its `[admins]` entry — run **Set Admin Password**. |

## Backups and Restore

Both volumes are copied wholesale (`ofVolumes('main', 'config')`) — databases, `local.ini` with the hashed admin password, and `store.json`.

A restored instance comes back with the admin password, server `uuid` and cookie secret that were current when the backup was taken, and starts without a task. If the password was changed after that backup, the older one is back in force: LiveSync clients configured with the newer password need to be updated, or **Set Admin Password** run again.

## Limitations and Differences

1. Single node only. Clustering and the `_cluster_setup` flow are not supported; `[cluster] n` is fixed at 1.
2. The admin username is always `admin`. Additional users and per-database security can be created through Fauxton or the API as upstream documents.
3. CORS allows only the Obsidian desktop and mobile origins and `http://localhost`. A browser-based client on another origin needs its origin added to `[cors] origins` through Fauxton's configuration page.
4. The Nouveau full-text search service is not included.

---

## Quick Reference for AI Consumers

```yaml
package_id: couchdb
image: couchdb
architectures: [x86_64, aarch64]
subcontainers: [couchdb]
volumes:
  main: /opt/couchdb/data
  config: /opt/couchdb/etc/local.d
file_models:
  - config/00-startos.ini
  - config/local.ini
  - main/store.json
startos_managed_env_vars: []
dependencies: none
interfaces:
  api: { type: api, port: 5984 }
  ui: { type: ui, port: 5984 }
actions:
  - set-admin-password
  - compact-databases
tasks:
  - { action: set-admin-password, severity: critical }
health_checks:
  - couchdb
```
