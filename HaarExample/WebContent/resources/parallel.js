﻿(function(){function h(){this._callbacks=[];this._errCallbacks=[];this._resolved=0;this._result=null}function e(d,a){this.data=d;var c=l,b=a;b||(b={});for(var f in c)b[f]===void 0&&(b[f]=c[f]);this.options=b;this.operation=new h;this.operation.resolve(null,this.data);this.requiredScripts=[];this.requiredFunctions=[]}var g=typeof module!=="undefined"&&module.exports,j=j||function(d){setTimeout(d,0)},i=g?require(__dirname+"/Worker.js"):self.Worker,k=typeof self!=="undefined"?self.URL?self.URL:self.webkitURL:
null,m=g||self.Worker;h.prototype.resolve=function(d,a){if(d){this._resolved=2;this._result=d;for(var c=0;c<this._errCallbacks.length;++c)this._errCallbacks[c](a)}else{this._resolved=1;this._result=a;for(c=0;c<this._callbacks.length;++c)this._callbacks[c](a)}this._callbacks=[];this._errCallbacks=[]};h.prototype.then=function(d,a){if(this._resolved===1)d&&d(this._result);else if(this._resolved===2)a&&a(this._result);else return d&&(this._callbacks[this._callbacks.length]=d),a&&(this._errCallbacks[this._errCallbacks.length]=
a),this};var l={evalPath:g?__dirname+"/eval.js":null,maxWorkers:g?require("os").cpus().length:4,synchronous:!0};e.isSupported=function(){return m};e.prototype.getWorkerSource=function(d){var a="",c=0;!g&&this.requiredScripts.length!==0&&(a+='importScripts("'+this.requiredScripts.join('","')+'");\r\n');for(c=0;c<this.requiredFunctions.length;++c)a+=this.requiredFunctions[c].name?"var "+this.requiredFunctions[c].name+" = "+this.requiredFunctions[c].fn.toString()+";":this.requiredFunctions[c].fn.toString();
return g?a+'process.on("message", function(e) {process.send(JSON.stringify(('+d.toString()+")(JSON.parse(e).data)))})":a+"self.onmessage = function(e) {self.postMessage(("+d.toString()+")(e.data))}"};e.prototype.require=function(){for(var d=Array.prototype.slice.call(arguments,0),a,c=0;c<d.length;c++)a=d[c],typeof a==="string"?this.requiredScripts.push(a):typeof a==="function"?this.requiredFunctions.push({fn:a}):typeof a==="object"&&this.requiredFunctions.push(a);return this};e.prototype._spawnWorker=
function(d){var a,d=this.getWorkerSource(d);if(g)a=new i(this.options.evalPath),a.postMessage(d);else{if(i===void 0)return;try{if(this.requiredScripts.length!==0)if(this.options.evalPath!==null)a=new i(this.options.evalPath),a.postMessage(d);else throw Error("Can't use required scripts without eval.js!");else if(k){var c=new Blob([d],{type:"text/javascript"}),b=k.createObjectURL(c);a=new i(b)}else throw Error("Can't create a blob URL in this browser!");}catch(f){if(this.options.evalPath!==null)a=
new i(this.options.evalPath),a.postMessage(d);else throw f;}}return a};e.prototype.spawn=function(d){var a=this,c=new h;this.operation.then(function(){var b=a._spawnWorker(d);if(b!==void 0)b.onmessage=function(d){b.terminate();a.data=d.data;c.resolve(null,a.data)},b.postMessage(a.data);else if(a.options.synchronous)j(function(){a.data=d(a.data);c.resolve(null,a.data)});else throw Error("Workers do not exist and synchronous operation not allowed!");});this.operation=c;return this};e.prototype._spawnMapWorker=
function(d,a,c){var b=this,f=b._spawnWorker(a);if(f!==void 0)f.onmessage=function(a){f.terminate();b.data[d]=a.data;c()},f.postMessage(b.data[d]);else if(b.options.synchronous)j(function(){b.data[d]=a(b.data[d]);c()});else throw Error("Workers do not exist and synchronous operation not allowed!");};e.prototype.map=function(d){function a(){++f===c.data.length?e.resolve(null,c.data):b<c.data.length&&c._spawnMapWorker(b++,d,a)}if(!this.data.length)return this.spawn(d);var c=this,b=0,f=0,e=new h;this.operation.then(function(){for(;b-
f<c.options.maxWorkers&&b<c.data.length;++b)c._spawnMapWorker(b,d,a)});this.operation=e;return this};e.prototype._spawnReduceWorker=function(d,a,c){var b=this,f=b._spawnWorker(a);if(f!==void 0)f.onmessage=function(a){f.terminate();b.data[b.data.length]=a.data;c()},f.postMessage(d);else if(b.options.synchronous)j(function(){b.data[b.data.length]=a(d);c()});else throw Error("Workers do not exist and synchronous operation not allowed!");};e.prototype.reduce=function(d){function a(){--c;b.data.length===
1&&c===0?(b.data=b.data[0],f.resolve(null,b.data)):b.data.length>1&&(++c,b._spawnReduceWorker([b.data[0],b.data[1]],d,a),b.data.splice(0,2))}if(!this.data.length)throw Error("Can't reduce non-array data");var c=0,b=this,f=new h;this.operation.then(function(){if(b.data.length===1)f.resolve(null,b.data[0]);else{for(var e=0;e<b.options.maxWorkers&&e<Math.floor(b.data.length/2);++e)++c,b._spawnReduceWorker([b.data[e*2],b.data[e*2+1]],d,a);b.data.splice(0,e*2)}});this.operation=f;return this};e.prototype.then=
function(d,a){var c=this,b=new h;this.operation.then(function(){var a=d(c.data);if(a!==void 0)c.data=a;b.resolve(null,c.data)},a);this.operation=b;return this};g?module.exports=e:self.Parallel=e})();
