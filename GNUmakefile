NODE_MODULES := ./node_modules/

ENB := $(NODE_MODULES).bin/enb
NPM := npm

.PHONY: static
static::
	cd school-static; $(ENB) make; cd -
