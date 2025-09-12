"use strict";
var midscene_element_inspector = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // resolve-false:/empty-stub
  var require_empty_stub = __commonJS({
    "resolve-false:/empty-stub"(exports, module) {
      "use strict";
      module.exports = {};
    }
  });

  // ../../node_modules/.pnpm/js-sha256@0.11.0/node_modules/js-sha256/src/sha256.js
  var require_sha256 = __commonJS({
    "../../node_modules/.pnpm/js-sha256@0.11.0/node_modules/js-sha256/src/sha256.js"(exports, module) {
      "use strict";
      (function() {
        "use strict";
        var ERROR = "input is invalid type";
        var WINDOW = typeof window === "object";
        var root = WINDOW ? window : {};
        if (root.JS_SHA256_NO_WINDOW) {
          WINDOW = false;
        }
        var WEB_WORKER = !WINDOW && typeof self === "object";
        var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node;
        if (NODE_JS) {
          root = global;
        } else if (WEB_WORKER) {
          root = self;
        }
        var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && typeof module === "object" && module.exports;
        var AMD = typeof define === "function" && define.amd;
        var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
        var HEX_CHARS = "0123456789abcdef".split("");
        var EXTRA = [-2147483648, 8388608, 32768, 128];
        var SHIFT = [24, 16, 8, 0];
        var K = [
          1116352408,
          1899447441,
          3049323471,
          3921009573,
          961987163,
          1508970993,
          2453635748,
          2870763221,
          3624381080,
          310598401,
          607225278,
          1426881987,
          1925078388,
          2162078206,
          2614888103,
          3248222580,
          3835390401,
          4022224774,
          264347078,
          604807628,
          770255983,
          1249150122,
          1555081692,
          1996064986,
          2554220882,
          2821834349,
          2952996808,
          3210313671,
          3336571891,
          3584528711,
          113926993,
          338241895,
          666307205,
          773529912,
          1294757372,
          1396182291,
          1695183700,
          1986661051,
          2177026350,
          2456956037,
          2730485921,
          2820302411,
          3259730800,
          3345764771,
          3516065817,
          3600352804,
          4094571909,
          275423344,
          430227734,
          506948616,
          659060556,
          883997877,
          958139571,
          1322822218,
          1537002063,
          1747873779,
          1955562222,
          2024104815,
          2227730452,
          2361852424,
          2428436474,
          2756734187,
          3204031479,
          3329325298
        ];
        var OUTPUT_TYPES = ["hex", "array", "digest", "arrayBuffer"];
        var blocks = [];
        if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
          Array.isArray = function(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
          };
        }
        if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
          ArrayBuffer.isView = function(obj) {
            return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
          };
        }
        var createOutputMethod = function(outputType, is224) {
          return function(message) {
            return new Sha256(is224, true).update(message)[outputType]();
          };
        };
        var createMethod = function(is224) {
          var method = createOutputMethod("hex", is224);
          if (NODE_JS) {
            method = nodeWrap(method, is224);
          }
          method.create = function() {
            return new Sha256(is224);
          };
          method.update = function(message) {
            return method.create().update(message);
          };
          for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
            var type = OUTPUT_TYPES[i];
            method[type] = createOutputMethod(type, is224);
          }
          return method;
        };
        var nodeWrap = function(method, is224) {
          var crypto = require_empty_stub();
          var Buffer2 = require_empty_stub().Buffer;
          var algorithm = is224 ? "sha224" : "sha256";
          var bufferFrom;
          if (Buffer2.from && !root.JS_SHA256_NO_BUFFER_FROM) {
            bufferFrom = Buffer2.from;
          } else {
            bufferFrom = function(message) {
              return new Buffer2(message);
            };
          }
          var nodeMethod = function(message) {
            if (typeof message === "string") {
              return crypto.createHash(algorithm).update(message, "utf8").digest("hex");
            } else {
              if (message === null || message === void 0) {
                throw new Error(ERROR);
              } else if (message.constructor === ArrayBuffer) {
                message = new Uint8Array(message);
              }
            }
            if (Array.isArray(message) || ArrayBuffer.isView(message) || message.constructor === Buffer2) {
              return crypto.createHash(algorithm).update(bufferFrom(message)).digest("hex");
            } else {
              return method(message);
            }
          };
          return nodeMethod;
        };
        var createHmacOutputMethod = function(outputType, is224) {
          return function(key, message) {
            return new HmacSha256(key, is224, true).update(message)[outputType]();
          };
        };
        var createHmacMethod = function(is224) {
          var method = createHmacOutputMethod("hex", is224);
          method.create = function(key) {
            return new HmacSha256(key, is224);
          };
          method.update = function(key, message) {
            return method.create(key).update(message);
          };
          for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
            var type = OUTPUT_TYPES[i];
            method[type] = createHmacOutputMethod(type, is224);
          }
          return method;
        };
        function Sha256(is224, sharedMemory) {
          if (sharedMemory) {
            blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
            this.blocks = blocks;
          } else {
            this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          }
          if (is224) {
            this.h0 = 3238371032;
            this.h1 = 914150663;
            this.h2 = 812702999;
            this.h3 = 4144912697;
            this.h4 = 4290775857;
            this.h5 = 1750603025;
            this.h6 = 1694076839;
            this.h7 = 3204075428;
          } else {
            this.h0 = 1779033703;
            this.h1 = 3144134277;
            this.h2 = 1013904242;
            this.h3 = 2773480762;
            this.h4 = 1359893119;
            this.h5 = 2600822924;
            this.h6 = 528734635;
            this.h7 = 1541459225;
          }
          this.block = this.start = this.bytes = this.hBytes = 0;
          this.finalized = this.hashed = false;
          this.first = true;
          this.is224 = is224;
        }
        Sha256.prototype.update = function(message) {
          if (this.finalized) {
            return;
          }
          var notString, type = typeof message;
          if (type !== "string") {
            if (type === "object") {
              if (message === null) {
                throw new Error(ERROR);
              } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
                message = new Uint8Array(message);
              } else if (!Array.isArray(message)) {
                if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
                  throw new Error(ERROR);
                }
              }
            } else {
              throw new Error(ERROR);
            }
            notString = true;
          }
          var code, index = 0, i, length = message.length, blocks2 = this.blocks;
          while (index < length) {
            if (this.hashed) {
              this.hashed = false;
              blocks2[0] = this.block;
              this.block = blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
            }
            if (notString) {
              for (i = this.start; index < length && i < 64; ++index) {
                blocks2[i >>> 2] |= message[index] << SHIFT[i++ & 3];
              }
            } else {
              for (i = this.start; index < length && i < 64; ++index) {
                code = message.charCodeAt(index);
                if (code < 128) {
                  blocks2[i >>> 2] |= code << SHIFT[i++ & 3];
                } else if (code < 2048) {
                  blocks2[i >>> 2] |= (192 | code >>> 6) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                } else if (code < 55296 || code >= 57344) {
                  blocks2[i >>> 2] |= (224 | code >>> 12) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                } else {
                  code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
                  blocks2[i >>> 2] |= (240 | code >>> 18) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code >>> 12 & 63) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code >>> 6 & 63) << SHIFT[i++ & 3];
                  blocks2[i >>> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
                }
              }
            }
            this.lastByteIndex = i;
            this.bytes += i - this.start;
            if (i >= 64) {
              this.block = blocks2[16];
              this.start = i - 64;
              this.hash();
              this.hashed = true;
            } else {
              this.start = i;
            }
          }
          if (this.bytes > 4294967295) {
            this.hBytes += this.bytes / 4294967296 << 0;
            this.bytes = this.bytes % 4294967296;
          }
          return this;
        };
        Sha256.prototype.finalize = function() {
          if (this.finalized) {
            return;
          }
          this.finalized = true;
          var blocks2 = this.blocks, i = this.lastByteIndex;
          blocks2[16] = this.block;
          blocks2[i >>> 2] |= EXTRA[i & 3];
          this.block = blocks2[16];
          if (i >= 56) {
            if (!this.hashed) {
              this.hash();
            }
            blocks2[0] = this.block;
            blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
          }
          blocks2[14] = this.hBytes << 3 | this.bytes >>> 29;
          blocks2[15] = this.bytes << 3;
          this.hash();
        };
        Sha256.prototype.hash = function() {
          var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6, h = this.h7, blocks2 = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;
          for (j = 16; j < 64; ++j) {
            t1 = blocks2[j - 15];
            s0 = (t1 >>> 7 | t1 << 25) ^ (t1 >>> 18 | t1 << 14) ^ t1 >>> 3;
            t1 = blocks2[j - 2];
            s1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
            blocks2[j] = blocks2[j - 16] + s0 + blocks2[j - 7] + s1 << 0;
          }
          bc = b & c;
          for (j = 0; j < 64; j += 4) {
            if (this.first) {
              if (this.is224) {
                ab = 300032;
                t1 = blocks2[0] - 1413257819;
                h = t1 - 150054599 << 0;
                d = t1 + 24177077 << 0;
              } else {
                ab = 704751109;
                t1 = blocks2[0] - 210244248;
                h = t1 - 1521486534 << 0;
                d = t1 + 143694565 << 0;
              }
              this.first = false;
            } else {
              s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
              s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
              ab = a & b;
              maj = ab ^ a & c ^ bc;
              ch = e & f ^ ~e & g;
              t1 = h + s1 + ch + K[j] + blocks2[j];
              t2 = s0 + maj;
              h = d + t1 << 0;
              d = t1 + t2 << 0;
            }
            s0 = (d >>> 2 | d << 30) ^ (d >>> 13 | d << 19) ^ (d >>> 22 | d << 10);
            s1 = (h >>> 6 | h << 26) ^ (h >>> 11 | h << 21) ^ (h >>> 25 | h << 7);
            da = d & a;
            maj = da ^ d & b ^ ab;
            ch = h & e ^ ~h & f;
            t1 = g + s1 + ch + K[j + 1] + blocks2[j + 1];
            t2 = s0 + maj;
            g = c + t1 << 0;
            c = t1 + t2 << 0;
            s0 = (c >>> 2 | c << 30) ^ (c >>> 13 | c << 19) ^ (c >>> 22 | c << 10);
            s1 = (g >>> 6 | g << 26) ^ (g >>> 11 | g << 21) ^ (g >>> 25 | g << 7);
            cd = c & d;
            maj = cd ^ c & a ^ da;
            ch = g & h ^ ~g & e;
            t1 = f + s1 + ch + K[j + 2] + blocks2[j + 2];
            t2 = s0 + maj;
            f = b + t1 << 0;
            b = t1 + t2 << 0;
            s0 = (b >>> 2 | b << 30) ^ (b >>> 13 | b << 19) ^ (b >>> 22 | b << 10);
            s1 = (f >>> 6 | f << 26) ^ (f >>> 11 | f << 21) ^ (f >>> 25 | f << 7);
            bc = b & c;
            maj = bc ^ b & d ^ cd;
            ch = f & g ^ ~f & h;
            t1 = e + s1 + ch + K[j + 3] + blocks2[j + 3];
            t2 = s0 + maj;
            e = a + t1 << 0;
            a = t1 + t2 << 0;
            this.chromeBugWorkAround = true;
          }
          this.h0 = this.h0 + a << 0;
          this.h1 = this.h1 + b << 0;
          this.h2 = this.h2 + c << 0;
          this.h3 = this.h3 + d << 0;
          this.h4 = this.h4 + e << 0;
          this.h5 = this.h5 + f << 0;
          this.h6 = this.h6 + g << 0;
          this.h7 = this.h7 + h << 0;
        };
        Sha256.prototype.hex = function() {
          this.finalize();
          var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5, h6 = this.h6, h7 = this.h7;
          var hex = HEX_CHARS[h0 >>> 28 & 15] + HEX_CHARS[h0 >>> 24 & 15] + HEX_CHARS[h0 >>> 20 & 15] + HEX_CHARS[h0 >>> 16 & 15] + HEX_CHARS[h0 >>> 12 & 15] + HEX_CHARS[h0 >>> 8 & 15] + HEX_CHARS[h0 >>> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h1 >>> 28 & 15] + HEX_CHARS[h1 >>> 24 & 15] + HEX_CHARS[h1 >>> 20 & 15] + HEX_CHARS[h1 >>> 16 & 15] + HEX_CHARS[h1 >>> 12 & 15] + HEX_CHARS[h1 >>> 8 & 15] + HEX_CHARS[h1 >>> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h2 >>> 28 & 15] + HEX_CHARS[h2 >>> 24 & 15] + HEX_CHARS[h2 >>> 20 & 15] + HEX_CHARS[h2 >>> 16 & 15] + HEX_CHARS[h2 >>> 12 & 15] + HEX_CHARS[h2 >>> 8 & 15] + HEX_CHARS[h2 >>> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h3 >>> 28 & 15] + HEX_CHARS[h3 >>> 24 & 15] + HEX_CHARS[h3 >>> 20 & 15] + HEX_CHARS[h3 >>> 16 & 15] + HEX_CHARS[h3 >>> 12 & 15] + HEX_CHARS[h3 >>> 8 & 15] + HEX_CHARS[h3 >>> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h4 >>> 28 & 15] + HEX_CHARS[h4 >>> 24 & 15] + HEX_CHARS[h4 >>> 20 & 15] + HEX_CHARS[h4 >>> 16 & 15] + HEX_CHARS[h4 >>> 12 & 15] + HEX_CHARS[h4 >>> 8 & 15] + HEX_CHARS[h4 >>> 4 & 15] + HEX_CHARS[h4 & 15] + HEX_CHARS[h5 >>> 28 & 15] + HEX_CHARS[h5 >>> 24 & 15] + HEX_CHARS[h5 >>> 20 & 15] + HEX_CHARS[h5 >>> 16 & 15] + HEX_CHARS[h5 >>> 12 & 15] + HEX_CHARS[h5 >>> 8 & 15] + HEX_CHARS[h5 >>> 4 & 15] + HEX_CHARS[h5 & 15] + HEX_CHARS[h6 >>> 28 & 15] + HEX_CHARS[h6 >>> 24 & 15] + HEX_CHARS[h6 >>> 20 & 15] + HEX_CHARS[h6 >>> 16 & 15] + HEX_CHARS[h6 >>> 12 & 15] + HEX_CHARS[h6 >>> 8 & 15] + HEX_CHARS[h6 >>> 4 & 15] + HEX_CHARS[h6 & 15];
          if (!this.is224) {
            hex += HEX_CHARS[h7 >>> 28 & 15] + HEX_CHARS[h7 >>> 24 & 15] + HEX_CHARS[h7 >>> 20 & 15] + HEX_CHARS[h7 >>> 16 & 15] + HEX_CHARS[h7 >>> 12 & 15] + HEX_CHARS[h7 >>> 8 & 15] + HEX_CHARS[h7 >>> 4 & 15] + HEX_CHARS[h7 & 15];
          }
          return hex;
        };
        Sha256.prototype.toString = Sha256.prototype.hex;
        Sha256.prototype.digest = function() {
          this.finalize();
          var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5, h6 = this.h6, h7 = this.h7;
          var arr = [
            h0 >>> 24 & 255,
            h0 >>> 16 & 255,
            h0 >>> 8 & 255,
            h0 & 255,
            h1 >>> 24 & 255,
            h1 >>> 16 & 255,
            h1 >>> 8 & 255,
            h1 & 255,
            h2 >>> 24 & 255,
            h2 >>> 16 & 255,
            h2 >>> 8 & 255,
            h2 & 255,
            h3 >>> 24 & 255,
            h3 >>> 16 & 255,
            h3 >>> 8 & 255,
            h3 & 255,
            h4 >>> 24 & 255,
            h4 >>> 16 & 255,
            h4 >>> 8 & 255,
            h4 & 255,
            h5 >>> 24 & 255,
            h5 >>> 16 & 255,
            h5 >>> 8 & 255,
            h5 & 255,
            h6 >>> 24 & 255,
            h6 >>> 16 & 255,
            h6 >>> 8 & 255,
            h6 & 255
          ];
          if (!this.is224) {
            arr.push(h7 >>> 24 & 255, h7 >>> 16 & 255, h7 >>> 8 & 255, h7 & 255);
          }
          return arr;
        };
        Sha256.prototype.array = Sha256.prototype.digest;
        Sha256.prototype.arrayBuffer = function() {
          this.finalize();
          var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
          var dataView = new DataView(buffer);
          dataView.setUint32(0, this.h0);
          dataView.setUint32(4, this.h1);
          dataView.setUint32(8, this.h2);
          dataView.setUint32(12, this.h3);
          dataView.setUint32(16, this.h4);
          dataView.setUint32(20, this.h5);
          dataView.setUint32(24, this.h6);
          if (!this.is224) {
            dataView.setUint32(28, this.h7);
          }
          return buffer;
        };
        function HmacSha256(key, is224, sharedMemory) {
          var i, type = typeof key;
          if (type === "string") {
            var bytes = [], length = key.length, index = 0, code;
            for (i = 0; i < length; ++i) {
              code = key.charCodeAt(i);
              if (code < 128) {
                bytes[index++] = code;
              } else if (code < 2048) {
                bytes[index++] = 192 | code >>> 6;
                bytes[index++] = 128 | code & 63;
              } else if (code < 55296 || code >= 57344) {
                bytes[index++] = 224 | code >>> 12;
                bytes[index++] = 128 | code >>> 6 & 63;
                bytes[index++] = 128 | code & 63;
              } else {
                code = 65536 + ((code & 1023) << 10 | key.charCodeAt(++i) & 1023);
                bytes[index++] = 240 | code >>> 18;
                bytes[index++] = 128 | code >>> 12 & 63;
                bytes[index++] = 128 | code >>> 6 & 63;
                bytes[index++] = 128 | code & 63;
              }
            }
            key = bytes;
          } else {
            if (type === "object") {
              if (key === null) {
                throw new Error(ERROR);
              } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
                key = new Uint8Array(key);
              } else if (!Array.isArray(key)) {
                if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
                  throw new Error(ERROR);
                }
              }
            } else {
              throw new Error(ERROR);
            }
          }
          if (key.length > 64) {
            key = new Sha256(is224, true).update(key).array();
          }
          var oKeyPad = [], iKeyPad = [];
          for (i = 0; i < 64; ++i) {
            var b = key[i] || 0;
            oKeyPad[i] = 92 ^ b;
            iKeyPad[i] = 54 ^ b;
          }
          Sha256.call(this, is224, sharedMemory);
          this.update(iKeyPad);
          this.oKeyPad = oKeyPad;
          this.inner = true;
          this.sharedMemory = sharedMemory;
        }
        HmacSha256.prototype = new Sha256();
        HmacSha256.prototype.finalize = function() {
          Sha256.prototype.finalize.call(this);
          if (this.inner) {
            this.inner = false;
            var innerHash = this.array();
            Sha256.call(this, this.is224, this.sharedMemory);
            this.update(this.oKeyPad);
            this.update(innerHash);
            Sha256.prototype.finalize.call(this);
          }
        };
        var exports2 = createMethod();
        exports2.sha256 = exports2;
        exports2.sha224 = createMethod(true);
        exports2.sha256.hmac = createHmacMethod();
        exports2.sha224.hmac = createHmacMethod(true);
        if (COMMON_JS) {
          module.exports = exports2;
        } else {
          root.sha256 = exports2.sha256;
          root.sha224 = exports2.sha224;
          if (AMD) {
            define(function() {
              return exports2;
            });
          }
        }
      })();
    }
  });

  // src/extractor/index.ts
  var extractor_exports = {};
  __export(extractor_exports, {
    descriptionOfTree: () => descriptionOfTree,
    generateElementByPosition: () => generateElementByPosition,
    getElementInfoByXpath: () => getElementInfoByXpath,
    getNodeFromCacheList: () => getNodeFromCacheList,
    getNodeInfoByXpath: () => getNodeInfoByXpath,
    getXpathsById: () => getXpathsById,
    isNotContainerElement: () => isNotContainerElement,
    setNodeHashCacheListOnWindow: () => setNodeHashCacheListOnWindow,
    traverseTree: () => traverseTree,
    treeToList: () => treeToList,
    trimAttributes: () => trimAttributes,
    truncateText: () => truncateText,
    webExtractNodeTree: () => extractTreeNode,
    webExtractNodeTreeAsString: () => extractTreeNodeAsString,
    webExtractTextWithPosition: () => extractTextWithPosition
  });

  // src/extractor/tree.ts
  function truncateText(text, maxLength = 150) {
    if (typeof text === "undefined") {
      return "";
    }
    if (typeof text === "object") {
      text = JSON.stringify(text);
    }
    if (typeof text === "number") {
      return text.toString();
    }
    if (typeof text === "string" && text.length > maxLength) {
      return `${text.slice(0, maxLength)}...`;
    }
    if (typeof text === "string") {
      return text.trim();
    }
    return "";
  }
  function trimAttributes(attributes, truncateTextLength) {
    const tailorAttributes = Object.keys(attributes).reduce(
      (res, currentKey) => {
        const attributeVal = attributes[currentKey];
        if (currentKey === "style" || currentKey === "htmlTagName" || currentKey === "nodeType") {
          return res;
        }
        res[currentKey] = truncateText(attributeVal, truncateTextLength);
        return res;
      },
      {}
    );
    return tailorAttributes;
  }
  var nodeSizeThreshold = 4;
  function descriptionOfTree(tree, truncateTextLength, filterNonTextContent = false, visibleOnly = true) {
    const attributesString = (kv) => {
      return Object.entries(kv).map(
        ([key, value]) => `${key}="${truncateText(value, truncateTextLength)}"`
      ).join(" ");
    };
    function buildContentTree(node, indent = 0, visibleOnly2 = true) {
      var _a;
      let before = "";
      let contentWithIndent = "";
      let after = "";
      let emptyNode = true;
      const indentStr = "  ".repeat(indent);
      let children = "";
      for (let i = 0; i < (node.children || []).length; i++) {
        const childContent = buildContentTree(
          node.children[i],
          indent + 1,
          visibleOnly2
        );
        if (childContent) {
          children += `
${childContent}`;
        }
      }
      if (node.node && node.node.rect.width > nodeSizeThreshold && node.node.rect.height > nodeSizeThreshold && (!filterNonTextContent || filterNonTextContent && node.node.content) && (!visibleOnly2 || visibleOnly2 && node.node.isVisible)) {
        emptyNode = false;
        let nodeTypeString;
        if ((_a = node.node.attributes) == null ? void 0 : _a.htmlTagName) {
          nodeTypeString = node.node.attributes.htmlTagName.replace(/[<>]/g, "");
        } else {
          nodeTypeString = node.node.attributes.nodeType.replace(/\sNode$/, "").toLowerCase();
        }
        const markerId = node.node.indexId;
        const markerIdString = markerId ? `markerId="${markerId}"` : "";
        const rectAttribute = node.node.rect ? {
          left: node.node.rect.left,
          top: node.node.rect.top,
          width: node.node.rect.width,
          height: node.node.rect.height
        } : {};
        before = `<${nodeTypeString} id="${node.node.id}" ${markerIdString} ${attributesString(trimAttributes(node.node.attributes || {}, truncateTextLength))} ${attributesString(rectAttribute)}>`;
        const content = truncateText(node.node.content, truncateTextLength);
        contentWithIndent = content ? `
${indentStr}  ${content}` : "";
        after = `</${nodeTypeString}>`;
      } else if (!filterNonTextContent) {
        if (!children.trim().startsWith("<>")) {
          before = "<>";
          contentWithIndent = "";
          after = "</>";
        }
      }
      if (emptyNode && !children.trim()) {
        return "";
      }
      const result2 = `${indentStr}${before}${contentWithIndent}${children}
${indentStr}${after}`;
      if (result2.trim()) {
        return result2;
      }
      return "";
    }
    const result = buildContentTree(tree, 0, visibleOnly);
    return result.replace(/^\s*\n/gm, "");
  }
  function treeToList(tree) {
    const result = [];
    function dfs(node) {
      if (node.node) {
        result.push(node.node);
      }
      for (const child of node.children) {
        dfs(child);
      }
    }
    dfs(tree);
    return result;
  }
  function traverseTree(tree, onNode) {
    function dfs(node) {
      if (node.node) {
        node.node = onNode(node.node);
      }
      for (const child of node.children) {
        dfs(child);
      }
    }
    dfs(tree);
    return tree;
  }

  // src/constants/index.ts
  var CONTAINER_MINI_HEIGHT = 3;
  var CONTAINER_MINI_WIDTH = 3;

  // src/utils.ts
  var import_js_sha256 = __toESM(require_sha256());
  var hashMap = {};
  function generateHashId(rect, content = "") {
    const combined = JSON.stringify({
      content,
      rect
    });
    let sliceLength = 5;
    let slicedHash = "";
    const hashHex = import_js_sha256.sha256.create().update(combined).hex();
    const toLetters = (hex) => {
      return hex.split("").map((char) => {
        const code = Number.parseInt(char, 16);
        return String.fromCharCode(97 + code % 26);
      }).join("");
    };
    const hashLetters = toLetters(hashHex);
    while (sliceLength < hashLetters.length - 1) {
      slicedHash = hashLetters.slice(0, sliceLength);
      if (hashMap[slicedHash] && hashMap[slicedHash] !== combined) {
        sliceLength++;
        continue;
      }
      hashMap[slicedHash] = combined;
      break;
    }
    return slicedHash;
  }

  // src/extractor/dom-util.ts
  function isFormElement(node) {
    return node instanceof HTMLElement && (node.tagName.toLowerCase() === "input" || node.tagName.toLowerCase() === "textarea" || node.tagName.toLowerCase() === "select" || node.tagName.toLowerCase() === "option");
  }
  function isButtonElement(node) {
    return node instanceof HTMLElement && node.tagName.toLowerCase() === "button";
  }
  function isAElement(node) {
    return node instanceof HTMLElement && node.tagName.toLowerCase() === "a";
  }
  function isImgElement(node) {
    if (!includeBaseElement(node) && node instanceof Element) {
      const computedStyle = window.getComputedStyle(node);
      const backgroundImage = computedStyle.getPropertyValue("background-image");
      if (backgroundImage !== "none") {
        return true;
      }
    }
    if (isIconfont(node)) {
      return true;
    }
    return node instanceof HTMLElement && node.tagName.toLowerCase() === "img" || node instanceof SVGElement && node.tagName.toLowerCase() === "svg";
  }
  function isIconfont(node) {
    if (node instanceof Element) {
      const computedStyle = window.getComputedStyle(node);
      const fontFamilyValue = computedStyle.fontFamily || "";
      return fontFamilyValue.toLowerCase().indexOf("iconfont") >= 0;
    }
    return false;
  }
  function isNotContainerElement(node) {
    return isTextElement(node) || isIconfont(node) || isImgElement(node) || isButtonElement(node) || isAElement(node) || isFormElement(node);
  }
  function isTextElement(node) {
    var _a, _b;
    if (node instanceof Element) {
      if (((_a = node == null ? void 0 : node.childNodes) == null ? void 0 : _a.length) === 1 && (node == null ? void 0 : node.childNodes[0]) instanceof Text) {
        return true;
      }
    }
    return ((_b = node.nodeName) == null ? void 0 : _b.toLowerCase()) === "#text" && !isIconfont(node);
  }
  function isContainerElement(node) {
    if (!(node instanceof HTMLElement))
      return false;
    if (includeBaseElement(node)) {
      return false;
    }
    const computedStyle = window.getComputedStyle(node);
    const backgroundColor = computedStyle.getPropertyValue("background-color");
    if (backgroundColor) {
      return true;
    }
    return false;
  }
  function includeBaseElement(node) {
    if (!(node instanceof HTMLElement))
      return false;
    if (node.innerText) {
      return true;
    }
    const includeList = [
      "svg",
      "button",
      "input",
      "textarea",
      "select",
      "option",
      "img",
      "a"
    ];
    for (const tagName of includeList) {
      const element = node.querySelectorAll(tagName);
      if (element.length > 0) {
        return true;
      }
    }
    return false;
  }
  function generateElementByPosition(position) {
    const rect = {
      left: Math.max(position.x - 4, 0),
      top: Math.max(position.y - 4, 0),
      width: 8,
      height: 8
    };
    const id = generateHashId(rect);
    const element = {
      id,
      attributes: { nodeType: "POSITION Node" /* POSITION */ },
      rect,
      content: "",
      center: [position.x, position.y]
    };
    return element;
  }

  // src/extractor/util.ts
  var MAX_VALUE_LENGTH = 300;
  var debugMode = false;
  function setDebugMode(mode) {
    debugMode = mode;
  }
  function logger(..._msg) {
    if (!debugMode) {
      return;
    }
    console.log(..._msg);
  }
  function isElementPartiallyInViewport(rect, currentWindow, currentDocument, visibleAreaRatio = 2 / 3) {
    const elementHeight = rect.height;
    const elementWidth = rect.width;
    const viewportRect = {
      left: 0,
      top: 0,
      width: currentWindow.innerWidth || currentDocument.documentElement.clientWidth,
      height: currentWindow.innerHeight || currentDocument.documentElement.clientHeight,
      right: currentWindow.innerWidth || currentDocument.documentElement.clientWidth,
      bottom: currentWindow.innerHeight || currentDocument.documentElement.clientHeight,
      x: 0,
      y: 0,
      zoom: 1
    };
    const overlapRect = overlappedRect(rect, viewportRect);
    if (!overlapRect) {
      return false;
    }
    const visibleArea = overlapRect.width * overlapRect.height;
    const totalArea = elementHeight * elementWidth;
    return visibleArea / totalArea >= visibleAreaRatio;
  }
  function getPseudoElementContent(element, currentWindow) {
    if (!(element instanceof currentWindow.HTMLElement)) {
      return { before: "", after: "" };
    }
    const beforeContent = currentWindow.getComputedStyle(element, "::before").getPropertyValue("content");
    const afterContent = currentWindow.getComputedStyle(element, "::after").getPropertyValue("content");
    return {
      before: beforeContent === "none" ? "" : beforeContent.replace(/"/g, ""),
      after: afterContent === "none" ? "" : afterContent.replace(/"/g, "")
    };
  }
  function overlappedRect(rect1, rect2) {
    const left = Math.max(rect1.left, rect2.left);
    const top = Math.max(rect1.top, rect2.top);
    const right = Math.min(rect1.right, rect2.right);
    const bottom = Math.min(rect1.bottom, rect2.bottom);
    if (left < right && top < bottom) {
      return {
        left,
        top,
        right,
        bottom,
        width: right - left,
        height: bottom - top,
        x: left,
        y: top,
        zoom: 1
      };
    }
    return null;
  }
  function getRect(el, baseZoom, currentWindow) {
    let originalRect;
    let newZoom = 1;
    if (!(el instanceof currentWindow.HTMLElement)) {
      const range = currentWindow.document.createRange();
      range.selectNodeContents(el);
      originalRect = range.getBoundingClientRect();
    } else {
      originalRect = el.getBoundingClientRect();
      if (!("currentCSSZoom" in el)) {
        newZoom = Number.parseFloat(currentWindow.getComputedStyle(el).zoom) || 1;
      }
    }
    const zoom = newZoom * baseZoom;
    return {
      width: originalRect.width * zoom,
      height: originalRect.height * zoom,
      left: originalRect.left * zoom,
      top: originalRect.top * zoom,
      right: originalRect.right * zoom,
      bottom: originalRect.bottom * zoom,
      x: originalRect.x * zoom,
      y: originalRect.y * zoom,
      zoom
    };
  }
  var isElementCovered = (el, rect, currentWindow) => {
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const topElement = currentWindow.document.elementFromPoint(x, y);
    if (!topElement) {
      return false;
    }
    if (topElement === el) {
      return false;
    }
    if (el == null ? void 0 : el.contains(topElement)) {
      return false;
    }
    if (topElement == null ? void 0 : topElement.contains(el)) {
      return false;
    }
    const rectOfTopElement = getRect(topElement, 1, currentWindow);
    const overlapRect = overlappedRect(rect, rectOfTopElement);
    if (!overlapRect) {
      return false;
    }
    logger(el, "Element is covered by another element", {
      topElement,
      el,
      rect,
      x,
      y
    });
    return true;
  };
  function elementRect(el, currentWindow, currentDocument, baseZoom = 1) {
    if (!el) {
      logger(el, "Element is not in the DOM hierarchy");
      return false;
    }
    if (!(el instanceof currentWindow.HTMLElement) && el.nodeType !== Node.TEXT_NODE && el.nodeName.toLowerCase() !== "svg") {
      logger(el, "Element is not in the DOM hierarchy");
      return false;
    }
    if (el instanceof currentWindow.HTMLElement) {
      const style = currentWindow.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0" && el.tagName !== "INPUT") {
        logger(el, "Element is hidden");
        return false;
      }
    }
    const rect = getRect(el, baseZoom, currentWindow);
    if (rect.width === 0 && rect.height === 0) {
      logger(el, "Element has no size");
      return false;
    }
    if (baseZoom === 1 && isElementCovered(el, rect, currentWindow)) {
      return false;
    }
    const isVisible = isElementPartiallyInViewport(
      rect,
      currentWindow,
      currentDocument
    );
    let parent = el;
    const parentUntilNonStatic = (currentNode) => {
      let parent2 = currentNode == null ? void 0 : currentNode.parentElement;
      while (parent2) {
        const style = currentWindow.getComputedStyle(parent2);
        if (style.position !== "static") {
          return parent2;
        }
        parent2 = parent2.parentElement;
      }
      return null;
    };
    while (parent && parent !== currentDocument.body) {
      if (!(parent instanceof currentWindow.HTMLElement)) {
        parent = parent.parentElement;
        continue;
      }
      const parentStyle = currentWindow.getComputedStyle(parent);
      if (parentStyle.overflow === "hidden") {
        const parentRect = getRect(parent, 1, currentWindow);
        const tolerance = 10;
        if (rect.right < parentRect.left - tolerance || rect.left > parentRect.right + tolerance || rect.bottom < parentRect.top - tolerance || rect.top > parentRect.bottom + tolerance) {
          logger(el, "element is partially or totally hidden by an ancestor", {
            rect,
            parentRect
          });
          return false;
        }
      }
      if (parentStyle.position === "fixed" || parentStyle.position === "sticky") {
        break;
      }
      if (parentStyle.position === "absolute") {
        parent = parentUntilNonStatic(parent);
      } else {
        parent = parent.parentElement;
      }
    }
    return {
      left: Math.round(rect.left),
      top: Math.round(rect.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      zoom: rect.zoom,
      isVisible
    };
  }
  function getNodeAttributes(node, currentWindow) {
    if (!node || !(node instanceof currentWindow.HTMLElement) || !node.attributes) {
      return {};
    }
    const attributesList = Array.from(node.attributes).map((attr) => {
      if (attr.name === "class") {
        return [attr.name, `.${attr.value.split(" ").join(".")}`];
      }
      if (!attr.value) {
        return [];
      }
      let value = attr.value;
      if (value.startsWith("data:image")) {
        value = "image";
      }
      if (value.length > MAX_VALUE_LENGTH) {
        value = `${value.slice(0, MAX_VALUE_LENGTH)}...`;
      }
      return [attr.name, value];
    });
    return Object.fromEntries(attributesList);
  }
  function midsceneGenerateHash(node, content, rect) {
    const slicedHash = generateHashId(rect, content);
    if (node) {
      if (!window.midsceneNodeHashCacheList) {
        setNodeHashCacheListOnWindow();
      }
      setNodeToCacheList(node, slicedHash);
    }
    return slicedHash;
  }
  function setNodeHashCacheListOnWindow() {
    if (typeof window !== "undefined") {
      window.midsceneNodeHashCacheList = [];
    }
  }
  function setNodeToCacheList(node, id) {
    var _a;
    if (typeof window !== "undefined") {
      if (getNodeFromCacheList(id)) {
        return;
      }
      (_a = window.midsceneNodeHashCacheList) == null ? void 0 : _a.push({ node, id });
    }
  }
  function getNodeFromCacheList(id) {
    var _a, _b;
    if (typeof window !== "undefined") {
      return (_b = (_a = window.midsceneNodeHashCacheList) == null ? void 0 : _a.find(
        (item) => item.id === id
      )) == null ? void 0 : _b.node;
    }
    return null;
  }
  function getTopDocument() {
    const container = document.body || document;
    return container;
  }

  // src/extractor/web-extractor.ts
  var indexId = 0;
  function tagNameOfNode(node) {
    var _a, _b;
    let tagName = "";
    if (node instanceof HTMLElement) {
      tagName = (_a = node.tagName) == null ? void 0 : _a.toLowerCase();
    } else {
      const parentElement = node.parentElement;
      if (parentElement && parentElement instanceof HTMLElement) {
        tagName = (_b = parentElement.tagName) == null ? void 0 : _b.toLowerCase();
      }
    }
    return tagName ? `<${tagName}>` : "";
  }
  function collectElementInfo(node, currentWindow, currentDocument, baseZoom = 1, basePoint = { left: 0, top: 0 }, isContainer = false) {
    var _a, _b;
    const rect = elementRect(node, currentWindow, currentDocument, baseZoom);
    if (!rect) {
      return null;
    }
    if (rect.width < CONTAINER_MINI_WIDTH || rect.height < CONTAINER_MINI_HEIGHT) {
      return null;
    }
    if (basePoint.left !== 0 || basePoint.top !== 0) {
      rect.left += basePoint.left;
      rect.top += basePoint.top;
    }
    if (rect.height >= window.innerHeight && rect.width >= window.innerWidth) {
      return null;
    }
    if (isFormElement(node)) {
      const attributes = getNodeAttributes(node, currentWindow);
      let valueContent = attributes.value || attributes.placeholder || node.textContent || "";
      const nodeHashId = midsceneGenerateHash(node, valueContent, rect);
      const tagName = node.tagName.toLowerCase();
      if (node.tagName.toLowerCase() === "select") {
        const selectedOption = node.options[node.selectedIndex];
        valueContent = (selectedOption == null ? void 0 : selectedOption.textContent) || "";
      }
      if ((node.tagName.toLowerCase() === "input" || node.tagName.toLowerCase() === "textarea") && node.value) {
        valueContent = node.value;
      }
      const elementInfo = {
        id: nodeHashId,
        nodeHashId,
        nodeType: "FORM_ITEM Node" /* FORM_ITEM */,
        indexId: indexId++,
        attributes: __spreadProps(__spreadValues({}, attributes), {
          htmlTagName: `<${tagName}>`,
          nodeType: "FORM_ITEM Node" /* FORM_ITEM */
        }),
        content: valueContent.trim(),
        rect,
        center: [
          Math.round(rect.left + rect.width / 2),
          Math.round(rect.top + rect.height / 2)
        ],
        zoom: rect.zoom,
        isVisible: rect.isVisible
      };
      return elementInfo;
    }
    if (isButtonElement(node)) {
      const rect2 = mergeElementAndChildrenRects(
        node,
        currentWindow,
        currentDocument,
        baseZoom
      );
      if (!rect2) {
        return null;
      }
      const attributes = getNodeAttributes(node, currentWindow);
      const pseudo = getPseudoElementContent(node, currentWindow);
      const content = node.innerText || pseudo.before || pseudo.after || "";
      const nodeHashId = midsceneGenerateHash(node, content, rect2);
      const elementInfo = {
        id: nodeHashId,
        indexId: indexId++,
        nodeHashId,
        nodeType: "BUTTON Node" /* BUTTON */,
        attributes: __spreadProps(__spreadValues({}, attributes), {
          htmlTagName: tagNameOfNode(node),
          nodeType: "BUTTON Node" /* BUTTON */
        }),
        content,
        rect: rect2,
        center: [
          Math.round(rect2.left + rect2.width / 2),
          Math.round(rect2.top + rect2.height / 2)
        ],
        zoom: rect2.zoom,
        isVisible: rect2.isVisible
      };
      return elementInfo;
    }
    if (isImgElement(node)) {
      const attributes = getNodeAttributes(node, currentWindow);
      const nodeHashId = midsceneGenerateHash(node, "", rect);
      const elementInfo = {
        id: nodeHashId,
        indexId: indexId++,
        nodeHashId,
        attributes: __spreadProps(__spreadValues(__spreadValues({}, attributes), ((_a = node.nodeName) == null ? void 0 : _a.toLowerCase()) === "svg" ? {
          svgContent: "true"
        } : {}), {
          nodeType: "IMG Node" /* IMG */,
          htmlTagName: tagNameOfNode(node)
        }),
        nodeType: "IMG Node" /* IMG */,
        content: "",
        rect,
        center: [
          Math.round(rect.left + rect.width / 2),
          Math.round(rect.top + rect.height / 2)
        ],
        zoom: rect.zoom,
        isVisible: rect.isVisible
      };
      return elementInfo;
    }
    if (isTextElement(node)) {
      const text = (_b = node.textContent) == null ? void 0 : _b.trim().replace(/\n+/g, " ");
      if (!text) {
        return null;
      }
      const attributes = getNodeAttributes(node, currentWindow);
      const attributeKeys = Object.keys(attributes);
      if (!text.trim() && attributeKeys.length === 0) {
        return null;
      }
      const nodeHashId = midsceneGenerateHash(node, text, rect);
      const elementInfo = {
        id: nodeHashId,
        indexId: indexId++,
        nodeHashId,
        nodeType: "TEXT Node" /* TEXT */,
        attributes: __spreadProps(__spreadValues({}, attributes), {
          nodeType: "TEXT Node" /* TEXT */,
          htmlTagName: tagNameOfNode(node)
        }),
        center: [
          Math.round(rect.left + rect.width / 2),
          Math.round(rect.top + rect.height / 2)
        ],
        content: text,
        rect,
        zoom: rect.zoom,
        isVisible: rect.isVisible
      };
      return elementInfo;
    }
    if (isAElement(node)) {
      const attributes = getNodeAttributes(node, currentWindow);
      const pseudo = getPseudoElementContent(node, currentWindow);
      const content = node.innerText || pseudo.before || pseudo.after || "";
      const nodeHashId = midsceneGenerateHash(node, content, rect);
      const elementInfo = {
        id: nodeHashId,
        indexId: indexId++,
        nodeHashId,
        nodeType: "Anchor Node" /* A */,
        attributes: __spreadProps(__spreadValues({}, attributes), {
          htmlTagName: tagNameOfNode(node),
          nodeType: "Anchor Node" /* A */
        }),
        content,
        rect,
        center: [
          Math.round(rect.left + rect.width / 2),
          Math.round(rect.top + rect.height / 2)
        ],
        zoom: rect.zoom,
        isVisible: rect.isVisible
      };
      return elementInfo;
    }
    if (isContainerElement(node) || isContainer) {
      const attributes = getNodeAttributes(node, currentWindow);
      const nodeHashId = midsceneGenerateHash(node, "", rect);
      const elementInfo = {
        id: nodeHashId,
        nodeHashId,
        indexId: indexId++,
        nodeType: "CONTAINER Node" /* CONTAINER */,
        attributes: __spreadProps(__spreadValues({}, attributes), {
          nodeType: "CONTAINER Node" /* CONTAINER */,
          htmlTagName: tagNameOfNode(node)
        }),
        content: "",
        rect,
        center: [
          Math.round(rect.left + rect.width / 2),
          Math.round(rect.top + rect.height / 2)
        ],
        zoom: rect.zoom,
        isVisible: rect.isVisible
      };
      return elementInfo;
    }
    return null;
  }
  function extractTextWithPosition(initNode, debugMode2 = false) {
    const elementNode = extractTreeNode(initNode, debugMode2);
    const elementInfoArray = [];
    function dfsTopChildren(node) {
      if (node.node) {
        elementInfoArray.push(node.node);
      }
      for (let i = 0; i < node.children.length; i++) {
        dfsTopChildren(node.children[i]);
      }
    }
    dfsTopChildren({ children: elementNode.children, node: elementNode.node });
    return elementInfoArray;
  }
  function extractTreeNodeAsString(initNode, visibleOnly = false, debugMode2 = false) {
    const elementNode = extractTreeNode(initNode, debugMode2);
    return descriptionOfTree(elementNode, void 0, false, visibleOnly);
  }
  function extractTreeNode(initNode, debugMode2 = false) {
    setDebugMode(debugMode2);
    indexId = 0;
    const topDocument = getTopDocument();
    const startNode = initNode || topDocument;
    const topChildren = [];
    function dfs(node, currentWindow, currentDocument, baseZoom = 1, basePoint = { left: 0, top: 0 }) {
      if (!node) {
        return null;
      }
      if (node.nodeType && node.nodeType === 10) {
        return null;
      }
      const elementInfo = collectElementInfo(
        node,
        currentWindow,
        currentDocument,
        baseZoom,
        basePoint
      );
      if (node instanceof currentWindow.HTMLIFrameElement) {
        if (node.contentWindow && node.contentWindow) {
          return null;
        }
      }
      const nodeInfo = {
        node: elementInfo,
        children: []
      };
      if ((elementInfo == null ? void 0 : elementInfo.nodeType) === "BUTTON Node" /* BUTTON */ || (elementInfo == null ? void 0 : elementInfo.nodeType) === "IMG Node" /* IMG */ || (elementInfo == null ? void 0 : elementInfo.nodeType) === "TEXT Node" /* TEXT */ || (elementInfo == null ? void 0 : elementInfo.nodeType) === "FORM_ITEM Node" /* FORM_ITEM */ || (elementInfo == null ? void 0 : elementInfo.nodeType) === "CONTAINER Node" /* CONTAINER */) {
        return nodeInfo;
      }
      const rect = getRect(node, baseZoom, currentWindow);
      for (let i = 0; i < node.childNodes.length; i++) {
        logger("will dfs", node.childNodes[i]);
        const childNodeInfo = dfs(
          node.childNodes[i],
          currentWindow,
          currentDocument,
          rect.zoom,
          basePoint
        );
        if (Array.isArray(childNodeInfo)) {
          nodeInfo.children.push(...childNodeInfo);
        } else if (childNodeInfo) {
          nodeInfo.children.push(childNodeInfo);
        }
      }
      if (nodeInfo.node === null) {
        if (nodeInfo.children.length === 0) {
          return null;
        }
        return nodeInfo.children;
      }
      return nodeInfo;
    }
    const rootNodeInfo = dfs(startNode, window, document, 1, {
      left: 0,
      top: 0
    });
    if (Array.isArray(rootNodeInfo)) {
      topChildren.push(...rootNodeInfo);
    } else if (rootNodeInfo) {
      topChildren.push(rootNodeInfo);
    }
    if (startNode === topDocument) {
      const iframes = document.querySelectorAll("iframe");
      for (let i = 0; i < iframes.length; i++) {
        const iframe = iframes[i];
        if (iframe.contentDocument && iframe.contentWindow) {
          const iframeInfo = collectElementInfo(iframe, window, document, 1);
          if (iframeInfo) {
            const iframeChildren = dfs(
              iframe.contentDocument.body,
              iframe.contentWindow,
              iframe.contentDocument,
              1,
              {
                left: iframeInfo.rect.left,
                top: iframeInfo.rect.top
              }
            );
            if (Array.isArray(iframeChildren)) {
              topChildren.push(...iframeChildren);
            } else if (iframeChildren) {
              topChildren.push(iframeChildren);
            }
          }
        }
      }
    }
    return {
      node: null,
      children: topChildren
    };
  }
  function mergeElementAndChildrenRects(node, currentWindow, currentDocument, baseZoom = 1) {
    const selfRect = elementRect(node, currentWindow, currentDocument, baseZoom);
    if (!selfRect)
      return null;
    let minLeft = selfRect.left;
    let minTop = selfRect.top;
    let maxRight = selfRect.left + selfRect.width;
    let maxBottom = selfRect.top + selfRect.height;
    function traverse(child) {
      for (let i = 0; i < child.childNodes.length; i++) {
        const sub = child.childNodes[i];
        if (sub.nodeType === 1) {
          const rect = elementRect(sub, currentWindow, currentDocument, baseZoom);
          if (rect) {
            minLeft = Math.min(minLeft, rect.left);
            minTop = Math.min(minTop, rect.top);
            maxRight = Math.max(maxRight, rect.left + rect.width);
            maxBottom = Math.max(maxBottom, rect.top + rect.height);
          }
          traverse(sub);
        }
      }
    }
    traverse(node);
    return __spreadProps(__spreadValues({}, selfRect), {
      left: minLeft,
      top: minTop,
      width: maxRight - minLeft,
      height: maxBottom - minTop
    });
  }

  // src/extractor/locator.ts
  var getElementIndex = (element) => {
    let index = 1;
    let prev = element.previousElementSibling;
    while (prev) {
      if (prev.nodeName.toLowerCase() === element.nodeName.toLowerCase()) {
        index++;
      }
      prev = prev.previousElementSibling;
    }
    return index;
  };
  var getTextNodeIndex = (textNode) => {
    let index = 1;
    let current = textNode.previousSibling;
    while (current) {
      if (current.nodeType === Node.TEXT_NODE) {
        index++;
      }
      current = current.previousSibling;
    }
    return index;
  };
  var createNormalizeSpaceCondition = (textContent) => {
    return `[normalize-space()="${textContent}"]`;
  };
  var addTextContentToXPath = (el, baseXPath) => {
    var _a;
    const textContent = (_a = el.textContent) == null ? void 0 : _a.trim();
    if (textContent && (isButtonElement(el) || isFormElement(el))) {
      return `${baseXPath}${createNormalizeSpaceCondition(textContent)}`;
    }
    return baseXPath;
  };
  var getElementXPath = (element) => {
    var _a;
    if (element.nodeType === Node.TEXT_NODE) {
      const parentNode = element.parentNode;
      if (parentNode && parentNode.nodeType === Node.ELEMENT_NODE) {
        const parentXPath2 = getElementXPath(parentNode);
        const textIndex = getTextNodeIndex(element);
        const textContent = (_a = element.textContent) == null ? void 0 : _a.trim();
        if (textContent) {
          return `${parentXPath2}/text()[${textIndex}]${createNormalizeSpaceCondition(textContent)}`;
        }
        return `${parentXPath2}/text()[${textIndex}]`;
      }
      return "";
    }
    if (element.nodeType !== Node.ELEMENT_NODE)
      return "";
    const el = element;
    if (el === document.documentElement) {
      return "/html";
    }
    if (el === document.body) {
      return "/html/body";
    }
    const isSVG = el.namespaceURI === "http://www.w3.org/2000/svg";
    const tagName = el.nodeName.toLowerCase();
    if (isSVG && tagName === "svg") {
      return getElementXPath(el.parentNode);
    }
    if (!el.parentNode) {
      const baseXPath2 = `/${tagName}`;
      return addTextContentToXPath(el, baseXPath2);
    }
    const parentXPath = getElementXPath(el.parentNode);
    const index = getElementIndex(el);
    const baseXPath = `${parentXPath}/${tagName}[${index}]`;
    return addTextContentToXPath(el, baseXPath);
  };
  function generateXPaths(node) {
    if (!node)
      return [];
    const fullXPath = getElementXPath(node);
    return [fullXPath];
  }
  function getXpathsById(id) {
    const node = getNodeFromCacheList(id);
    if (!node) {
      return null;
    }
    return generateXPaths(node);
  }
  function getNodeInfoByXpath(xpath) {
    const xpathResult = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    if (xpathResult.snapshotLength !== 1) {
      return null;
    }
    const node = xpathResult.snapshotItem(0);
    return node;
  }
  function getElementInfoByXpath(xpath) {
    const node = getNodeInfoByXpath(xpath);
    if (!node) {
      return null;
    }
    if (node instanceof HTMLElement) {
      const rect = getRect(node, 1, window);
      const isVisible = isElementPartiallyInViewport(rect, window, document, 1);
      if (!isVisible) {
        node.scrollIntoView({ behavior: "instant", block: "center" });
      }
    }
    return collectElementInfo(
      node,
      window,
      document,
      1,
      {
        left: 0,
        top: 0
      },
      true
    );
  }
  return __toCommonJS(extractor_exports);
})();
/*! Bundled license information:

js-sha256/src/sha256.js:
  (**
   * [js-sha256]{@link https://github.com/emn178/js-sha256}
   *
   * @version 0.11.0
   * @author Chen, Yi-Cyuan [emn178@gmail.com]
   * @copyright Chen, Yi-Cyuan 2014-2024
   * @license MIT
   *)
*/
