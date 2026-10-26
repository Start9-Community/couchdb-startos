# The official image, with two compromised certificate authorities removed from its trust store.
#
# eMudhra's intermediate signing keys were found to be guessable on 2026-10-17 and NSS 3.131.1
# distrusted three emSign roots on 2026-10-20. couchdb:3.5.3 is Debian trixie, whose
# ca-certificates (20250419+deb13u1) still trusts two of them — `emSign Root CA - C1` and
# `emSign ECC Root CA - C3`. Debian has not shipped the removal to trixie: inside the image
# `apt-cache policy ca-certificates` reports the installed version as the candidate, so there is
# nothing to apt-get and repacking the official image cannot fix it.
#
# This is the trust store CouchDB's replicator reads — `[replicator]
# ssl_trusted_certificates_file` defaults to /etc/ssl/certs/ca-certificates.crt — so an operator
# who turns on `verify_ssl_certificates` would otherwise be verifying remote replication targets
# against two authorities whose keys are in the wild. The default is `false`, which makes this
# defence rather than a fix for live behaviour — README.md § Limitations and Differences says so
# plainly, because an operator turning verification on is entitled to know what it checks against.
#
# **Drop this file once trixie ships a ca-certificates with the roots removed**, and put
# `source: { dockerTag: … }` back in the manifest — UPDATING.md § The CA override has the check.
# The `FROM` stays a floating tag, deliberately: when the image maintainers rebuild on a fixed
# Debian, a repack picks it up and the `sed` below quietly matches nothing.
FROM couchdb:3.5.3

# Debian's own mechanism: a `!` prefix in /etc/ca-certificates.conf deselects a certificate, and
# `update-ca-certificates --fresh` rebuilds the bundle and the hash links from what remains.
# emSign ECC Root CA - G3 is named too for completeness — NSS removed it as well, and Debian's set
# does not carry it today. emSign Root CA - G1 is left alone: Mozilla kept it.
#
# The last command is an assertion, not a report: if any of the three is still trusted after the
# rebuild, the build fails here rather than shipping an image that looks fixed.
RUN set -eu; \
    for cert in emSign_Root_CA_-_C1 emSign_ECC_Root_CA_-_C3 emSign_ECC_Root_CA_-_G3; do \
      sed -i "s|^mozilla/${cert}.crt$|!mozilla/${cert}.crt|" /etc/ca-certificates.conf; \
    done; \
    update-ca-certificates --fresh >/dev/null 2>&1; \
    if openssl crl2pkcs7 -nocrl -certfile /etc/ssl/certs/ca-certificates.crt \
       | openssl pkcs7 -print_certs -noout \
       | grep -E 'emSign (Root CA - C1|ECC Root CA - (C3|G3))'; then \
      echo "a distrusted emSign root is still in the bundle" >&2; exit 1; \
    fi
