Web Utils
=========

Development
-----------

```shell
docker build -t web-utils .
docker run -it -v $(pwd):/code -p 5173:5173 web-utils bash
```

Build & Publish
---------------

```shell
npm version X.X.X --no-git-tag-version
npm publish
```