uglify := ./node_modules/.bin/uglifyjs -m --comments "/^!/"

all: \
	dist

dist: \
	dist/livemarkup.js \
	dist/livemarkup.min.js \
	size

livemarkup.min.js: \
	livemarkup.js

dist/%.min.js: %.js
	$(uglify) $^ --source-map $@.map > $@

dist/%: %
	mkdir -p dist/
	cp $^ $@

size: dist/livemarkup.min.js
	@echo `cat dist/livemarkup.js | wc -c` raw
	@echo `cat $^ | wc -c` minified
	@echo `cat $^ | gzip | wc -c` minified gzipped

.PHONY: all size
