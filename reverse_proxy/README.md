# Reverse Proxy

This container is not automatically built and pushed by the GitLab pipeline. Instead, it must be built and pushed manually to the GitLab Registry to be pulled by the server whenever necessary.

## Deploy Instructions
```bash
docker build -t registry.gitlab.com/alexandreaam/lgp-3a/reverseproxy:stable .
docker push registry.gitlab.com/alexandreaam/lgp-3a/reverseproxy:stable
```