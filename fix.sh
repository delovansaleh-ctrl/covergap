#!/bin/bash
set -e
cd "/Users/deli/CLAUDE CODE/covergap"
rm -f .git/index.lock .git/HEAD.lock 2>/dev/null || true
git rm -r dist/ 2>/dev/null && echo "dist/ removed" || echo "dist/ already gone"
printf 'x' >> index.html
git add -A
git commit -m 'Remove dist from git, force redeploy'
git push
echo "DONE"
