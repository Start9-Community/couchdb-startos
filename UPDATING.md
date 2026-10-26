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

1. Set the `FROM` line in the root `Dockerfile` to `couchdb:<tag>`. (While the CA override below is in place the tag lives there, not in the manifest — `images.main.source` says `dockerBuild: {}`.)
2. Set `version` in `startos/versions/current.ts` to `<X.Y.Z>:0` — the three-part CouchDB version, dropping any fourth rebuild digit. A rebuild-only change (`X.Y.Z.N`) keeps the upstream part and bumps the downstream revision instead.
3. Write the release notes in every locale.

## The CA override

The root `Dockerfile` exists for one reason: `couchdb:3.5.3` is Debian trixie, and trixie still trusts two of the three emSign roots NSS distrusted on 2026-10-20 after eMudhra's intermediate keys were compromised. The `Dockerfile` deselects them and rebuilds the bundle.

**It is meant to be deleted.** Check whether Debian has shipped the removal:

```
docker run --rm --entrypoint sh couchdb:<tag> -c 'apt-get update -qq >/dev/null 2>&1; apt-cache policy ca-certificates'
```

If `Candidate` is newer than `Installed`, the official image is simply stale and the maintainers will pick it up on their next rebuild. If both have advanced past `20250419+deb13u1`, confirm the roots are gone:

```
docker run --rm --entrypoint sh couchdb:<tag> -c \
  'openssl crl2pkcs7 -nocrl -certfile /etc/ssl/certs/ca-certificates.crt \
   | openssl pkcs7 -print_certs -noout | grep -i emsign'
```

`emSign Root CA - G1` alone is the expected answer — Mozilla kept that one. With `C1` and `ECC Root CA - C3` absent, delete the `Dockerfile`, put `source: { dockerTag: 'couchdb:<tag>' }` back in `startos/manifest/index.ts`, and bump the revision. The build asserts the roots are gone, so it fails loudly rather than shipping an image that only looks fixed.
