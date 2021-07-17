# Colyseus Documentation

Documentation for [Colyseus](https://github.com/colyseus/colyseus/).

This project uses Markdown for documentation which is compiled with [mkdocs](http://www.mkdocs.org).

## Install and setup

```shell
pip install -r requirements.txt
```

## Development

```
mkdocs serve
```
## Docker

```
docker run --rm -it -p 8000:8000 -v ${PWD}:/docs lucidsightinc/mkdocs-material
```