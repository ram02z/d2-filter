#!/usr/bin/env node

var pandoc = require("pandoc-filter");
var which = require("which")
var filter = require("./lib/filter")

var resolvedOrNull = which.sync("d2", { nothrow: true });
if (resolvedOrNull === null) {
  console.error("d2 is not installed");
  return;
}
pandoc.stdio(filter.action);
