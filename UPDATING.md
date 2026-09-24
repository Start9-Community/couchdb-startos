# Updating the upstream version

CouchDB ships as the Docker official image `couchdb`, pinned by `dockerTag` in `startos/manifest/index.ts` (`images.main.source.dockerTag`).

## Determining the upstream version

List the published image tags, newest first:

```
curl -fsSL "https://hub.docker.com/v2/repositories/library/couchdb/tags?page_size=25&ordering=last_updated" | jq -r '.results[].name'
```

Use the plain `X.Y.Z` tag, or a four-part `X.Y.Z.N` tag where one exists — that is the same CouchDB release rebuilt by the image maintainers (for example on a newer Erlang/OTP). Never take a `-nouveau` tag: that variant bundles the Nouveau search service, which this package does not run.

Read the release notes at <https://docs.couchdb.org/en/stable/whatsnew/> before bumping; a minor release can change on-disk formats or defaults the package's `00-startos.ini` sets.

## Applying the bump

1. Set `images.main.source.dockerTag` in `startos/manifest/index.ts` to `couchdb:<tag>`.
2. Set `version` in `startos/versions/current.ts` to `<X.Y.Z>:0` — the three-part CouchDB version, dropping any fourth rebuild digit. A rebuild-only change (`X.Y.Z.N`) keeps the upstream part and bumps the downstream revision instead.
3. Write the release notes in every locale.
