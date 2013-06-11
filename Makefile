uglify := ./node_modules/.bin/uglifyjs -m --comments "/^!/"
coffee := ./node_modules/.bin/coffee
stylus := ./node_modules/.bin/stylus -u nib

all: \
	assets/vendor.js \
	assets/site.js

assets/vendor.js: \
	vendor/jquery-1.9.1.js \
	vendor/underscore-1.4.4.js \
	vendor/backbone-1.0.0.js
	cat $^ | $(uglify) > $@

assets/site.js: \
	assets/reminders.js
	cat $^ > $@

assets/%.js: src/%.coffee
	$(coffee) -s -c < $^ > $@

watch:
	while true; do make | grep -v "Nothing"; sleep 1; done

.PHONY: watch
