uglify := ./node_modules/.bin/uglifyjs

all: \
	livemarkup.min.js

livemarkup.min.js: \
	livemarkup.js

%.min.js: %.js
	$(uglify) < $^ > $@

size: livemarkup.min.js
	@echo `cat $^ | wc -c` minified
	@echo `cat $^ | gzip | wc -c` minified gzipped

.PHONY: all size
