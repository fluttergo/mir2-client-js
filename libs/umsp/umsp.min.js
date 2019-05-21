
/* ================ base64.js ================= */
function Base64() {

    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    };

    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}/* ================ md5.js ================= */
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data)
{
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
}
/* ================ format.js ================= */
//
// format - printf-like string formatting for JavaScript
// github.com/samsonjs/format
// @_sjs
//
// Copyright 2010 - 2013 Sami Samhuri <sami@samhuri.net>
//
// MIT License
// http://sjs.mit-license.org
//

var format = function (fmt){
    var argIndex = 1 // skip initial format argument
      , args = [].slice.call(arguments)
      , i = 0
      , n = fmt.length
      , result = ''
      , c
      , escaped = false
      , arg
      , tmp
      , leadingZero = false
      , precision
      , nextArg = function() { return args[argIndex++]; }
      , slurpNumber = function() {
          var digits = '';
          while (/\d/.test(fmt[i])) {
            digits += fmt[i++];
            c = fmt[i];
          }
          return digits.length > 0 ? parseInt(digits) : null;
        }
      ;
    for (; i < n; ++i) {
      c = fmt[i];
      if (escaped) {
        escaped = false;
        if (c == '.') {
          leadingZero = false;
          c = fmt[++i];
        }
        else if (c == '0' && fmt[i + 1] == '.') {
          leadingZero = true;
          i += 2;
          c = fmt[i];
        }
        else {
          leadingZero = true;
        }
        precision = slurpNumber();
        switch (c) {
        case 'b': // number in binary
          result += parseInt(nextArg(), 10).toString(2);
          break;
        case 'c': // character
          arg = nextArg();
          if (typeof arg === 'string' || arg instanceof String)
            result += arg;
          else
            result += String.fromCharCode(parseInt(arg, 10));
          break;
        case 'd': // number in decimal
          result += parseInt(nextArg(), 10);
          break;
        case 'f': // floating point number
          tmp = String(parseFloat(nextArg()).toFixed(precision || 6));
          result += leadingZero ? tmp : tmp.replace(/^0/, '');
          break;
        case 'j': // JSON
          result += JSON.stringify(nextArg());
          break;
        case 'o': // number in octal
          result += '0' + parseInt(nextArg(), 10).toString(8);
          break;
        case 's': // string
          result += nextArg();
          break;
        case 'x': // lowercase hexadecimal
          result += '0x' + parseInt(nextArg(), 10).toString(16);
          break;
        case 'X': // uppercase hexadecimal
          result += '0x' + parseInt(nextArg(), 10).toString(16).toUpperCase();
          break;
        default:
          result += c;
          break;
        }
      } else if (c === '%') {
        escaped = true;
      } else {
        result += c;
      }
    }
    return result;
};
/* ================ config.js ================= */
var ServerConfig = {
    LocalConf: {
        HOST_GATWAY_ADDR: "ws://127.0.0.1:8888/ws",
        GETHOSTLIST_URL: "http://127.0.0.1:8080/getHostList",
        REGISTER_USER_URL: "http://127.0.0.1:8080/user/regist"

    },
    Dev: {
        HOST_GATWAY_ADDR: "ws://192.168.9.95:8888/ws",
        GETHOSTLIST_URL: "http://192.168.9.95:8080/getHostList",
        REGISTER_USER_URL: "http://192.168.9.95:8080/user/regist"

    },
    Erdanger: {
        HOST_GATWAY_ADDR: "wss://erdange.com:8888/ws",
        GETHOSTLIST_URL: "https://api.erdange.com/getHostList",
        REGISTER_USER_URL: "https://api.erdange.com/user/regist"
    },
    HeXianMaJiang: {
        HOST_GATWAY_ADDR: "ws://websocket.hexianmajiang.com:8888/ws",
        GETHOSTLIST_URL: "http://api.hexianmajiang.com/getHostList",
        REGISTER_USER_URL: "http://api.hexianmajiang.com/user/regist"
    },
    fluttergo: {
        HOST_GATWAY_ADDR: "ws://118.24.53.22:8888/ws",
        GETHOSTLIST_URL: "http://fluttergo.com/getHostList",
        REGISTER_USER_URL: "http://fluttergo.com/user/regist"
    }
};

function getHostConfig(envir) {
    if (ServerConfig[envir] !== undefined) {
        return ServerConfig[envir];
    } else {
        console.warn("not found the envir config:`" +envir+"` ,use ServiceConfig.LocalConf");
        return ServerConfig.LocalConf;
    }
}
/* ================ msutil.js ================= */
if (typeof String.prototype.startsWith !== 'function') {
    String.prototype.startsWith = function (prefix){
        return this.slice(0, prefix.length) === prefix;
    };
}
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

function stringToUtf8ByteArray(a) {
    if(!(a&&(typeof a === "string"))){
        return new Uint8Array(0);
    }
    for (var b = [], c = 0, d = 0; d < a.length; d++) {
        var e = a.charCodeAt(d);
        128 > e ? b[c++] = e : (2048 > e ? b[c++] = e >> 6 | 192 : (55296 == (e & 64512) && d + 1 < a.length && 56320 == (a.charCodeAt(d + 1) & 64512) ? (e = 65536 + ((e & 1023) << 10) + (a.charCodeAt(++d) & 1023), b[c++] = e >> 18 | 240, b[c++] = e >> 12 & 63 | 128) : b[c++] = e >> 12 | 224, b[c++] = e >> 6 & 63 | 128), b[c++] = e & 63 | 128)
    }
    var buf = new Uint8Array(b.length);
    for (var i = 0; i < buf.length; i++) {
        buf[i] = b[i];

    }
    return buf;
}
function utf8ByteArrayToString (a) {
    for (var b = [], c = 0, d = 0; c < a.length;) {
        var e = a[c++];
        if (128 > e) b[d++] = String.fromCharCode(e); else if (191 < e && 224 > e) {
            var f = a[c++];
            b[d++] = String.fromCharCode((e & 31) << 6 | f & 63)
        } else if (239 < e && 365 > e) {
            var f = a[c++], g = a[c++], h = a[c++],
                e = ((e & 7) << 18 | (f & 63) << 12 | (g & 63) << 6 | h & 63) - 65536;
            b[d++] = String.fromCharCode(55296 + (e >> 10));
            b[d++] = String.fromCharCode(56320 + (e & 1023))
        } else f = a[c++], g = a[c++], b[d++] = String.fromCharCode((e & 15) << 12 | (f & 63) << 6 | g & 63)
    }
    return b.join("")
}
function str2u8array(str) {
    if(str===undefined||(typeof str !== "string")){
        return str;
    }
    var out = new Uint8Array(str.length*2);
    for(var i =0;i<str.length;i++){
        out[i*2] = str.charCodeAt(i)>>8;
        out[i*2+1] = str.charCodeAt(i);
    }
    return out;
}
function u8array2str(u8array) {
    var buf = new Uint16Array(u8array.length/2);
    for(var i =0;i<buf.length;i++){
        buf[i] = u8array[i*2]<<8|u8array[i*2+1];

    }
    return String.fromCharCode.apply(null, buf);

}

/**
 * @return {boolean}
 */
function LocalStore_Save(key,value) {
    //存储，IE6~7 cookie 其他浏览器HTML5本地存储
    if (window.localStorage) {
        localStorage.setItem(key, value);
        return true;
    }

    if(wx.setStorageSync){
        wx.setStorageSync(key,value);
        return true;
    } else {
        return false;
        // document.cookie+=(key+"="+value);
    }
}
/**
 * @return {boolean}
 */
function LocalStore_Clear() {
    //存储，IE6~7 cookie 其他浏览器HTML5本地存储
    if (window.localStorage) {
        localStorage.clear();
        return true;
    }
    if(wx.setStorageSync){
        wx.clearStorageSync();
        return true;
    } else {
        return false;
        // document.cookie+=(key+"="+value);
    }
}
/**
 * @return {null}
 */
function LocalStore_Load(key) {
    if(window.localStorage){
        return localStorage.getItem(key);
    }
    if(wx.getStorageSync){
        return wx.getStorageSync(key);
    }else{
        // return  document.cookie.replace(/(?:(?:^|.*;\s*)"+key+"\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        return null;
    }
}

function isIE() { //ie?
    return !!window.ActiveXObject || "ActiveXObject" in window;
}
/* ================ uiutil.js ================= */
function FakeRandom(seed) {
    this.next = function (range) {
        range = range || 100;
        var min = 0;
        seed = (seed * 9301 + 49297) % 233280;
        var rnd = seed / 233280.0;
        return Math.floor(min + rnd * (range - min));
    }

}


function getNowFormatDate() {
    var date = new Date();
    var ___ = "-";
    var __ = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentDate = "[" + date.getFullYear() + ___ + month
        + ___ + strDate + " " + date.getHours() + __
        + date.getMinutes() + __ + date.getSeconds() + "."
        + date.getMilliseconds() + "]";
    return currentDate;
}

function getFormatDate(dateString) {

    var date = new Date();
    date.setTime(Number(dateString));
    var ___ = "-";
    var __ = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentDate = "[" + date.getFullYear() + ___ + month
        + ___ + strDate + " " + date.getHours() + __
        + date.getMinutes() + __ + date.getSeconds() + "."
        + date.getMilliseconds() + "]";
    return currentDate;
}

function printLog(msg) {
    var loc = "";
    try {
        throw new Error();
    } catch (e) {
        var line = e.stack.split(/\n/)[2];
        loc = line.slice(line.lastIndexOf("/") + 1, line.lastIndexOf(")"));
    }
    var ta = document.getElementById('responseText');
    ta.value = ta.value + '\n' + getNowFormatDate() + "[" + loc + "]" + msg;
    ta.scrollTop = ta.scrollHeight;
}

function vt(viewName) {
    var elementsByName = document.getElementById(viewName);
    return elementsByName.value;
}

function svt(viewName, value) {
    var elementsByName = document.getElementById(viewName);
    return elementsByName.value = value;
}

function toArray(argument) {
    var args = [];
    for (var i = 0; i < argument.length; i++) {
        args.push(argument[i]);
    }
    return args;
}

var log = {};

log.openLog = function () {
    console.log("---- open log ----");
    log.i = console.log.bind(console
        , "[INFO] " + getNowFormatDate() + " ");
    log.e = console.error.bind(console
        , "[ERROR] " + getNowFormatDate() + " ");
};

log.closeLog = function () {
    console.log("---- close log ----");
    log.i = function () {
    };
    log.e = function () {
    };
};

log.openLog();//default, the log is opening
/* ================ umspdefine.js ================= */
var HEART_BEAT_INTERVAL = 60*1000; //心跳间隔时间

//================== CMD =======================
function UmspCMD() {
    return UmspCMD.prototype;
}
var Umsp = new UmspCMD();
function UmspCMDMap(){
    return UmspCMDMap.prototype;
}
var CMDDescMap = new UmspCMDMap();
var CmdToString = function (cmd) {
    return CMDDescMap[cmd];
};

Umsp.HEARTBEAT = 520;
CMDDescMap[Umsp.HEARTBEAT]="HEARTBEAT";

Umsp.LOGIN = 1;
CMDDescMap[Umsp.LOGIN]="LOGIN";

Umsp.LOGIN_RSP = 2;
CMDDescMap[Umsp.LOGIN_RSP]="LOGIN_RSP";

Umsp.LOGOUT = 3;
CMDDescMap[Umsp.LOGOUT]="LOGOUT";

Umsp.LOGOUT_RSP = 4;
CMDDescMap[Umsp.LOGOUT_RSP]="LOGOUT_RSP";

Umsp.MSG = 5;
CMDDescMap[Umsp.MSG]="MSG";

Umsp.MSG_RSP = 6;
CMDDescMap[Umsp.MSG_RSP]="MSG_RSP";

Umsp.ROOM_SERVICE_LOGIN = 7;
CMDDescMap[Umsp.ROOM_SERVICE_LOGIN]="ROOM_SERVICE_LOGIN";

Umsp.ROOM_SERVICE_LOGIN_RSP = 8;
CMDDescMap[Umsp.ROOM_SERVICE_LOGIN_RSP]="ROOM_SERVICE_LOGIN_RSP";

Umsp.MATCH = 9;
CMDDescMap[Umsp.MATCH]="MATCH";

Umsp.MATCH_RSP= 10;
CMDDescMap[Umsp.MATCH_RSP]="MATCH_RSP";

Umsp.ROOM_ENTER= 11;
CMDDescMap[Umsp.ROOM_ENTER]="ROOM_ENTER";

Umsp.ROOM_EXIT= 12;
CMDDescMap[Umsp.ROOM_EXIT]="ROOM_EXIT";

Umsp.ROOM_USER_CHANGED= 13;
CMDDescMap[Umsp.ROOM_USER_CHANGED]="ROOM_USER_CHANGED";

Umsp.ERR = 999;
CMDDescMap[Umsp.ERR]="ERR";

//================== UmspCMD =======================
var FIXED_HEAD_SIZE = 24;

//================== Bean ======================
function User(userID, gameID, nickName) {
    this.userID = userID;
    this.gameID = gameID;
    this.token = "";
    this.nickName = nickName;
    this.matchExtInfo = "";
    this.accessFlag = 0;
}

function Match(matchType) {
    this.matchType = matchType;
    this.roomName = "";
    this.roomTag = "";
    this.matchServiceIndex = 0;
    this.wantToMatchUser = null;
    this.rollValue = 0;
    this.rollRang = 0;
    this.maxUserCount = 2;
}

Match.prototype.RANDOM = 1;
Match.prototype.SAME_NAME = 1 << 1;
Match.prototype.SAME_NAME_WITH_PASSWORD = 1 << 2;
Match.prototype.GROUP = 1 << 3;
/* ================ umspprotocol.js ================= */
function Packet() {
    // noinspection JSUnusedLocalSymbols
    var header;//{UmspHeader}
    // noinspection JSUnusedLocalSymbols
    var payload;//*
    // noinspection JSUnusedLocalSymbols
    var buf;//{DataView}
}

function UmspHeader() {
    this.size = 0;
    this.x = 0;
    this.userID = 0;
    this.gameID = 0;
    this.serviceID = 0;
    this.cmd = 0;
    this.payload = "";
    this.toString = function () {
        return "size:" + this.size
        +" ,roomID:" + this.x
        +" ,userID:" + this.userID
        +" ,gameID:" + this.gameID
        +" ,serviceID:" + this.serviceID
        +" ,cmd:[" + CmdToString(this.cmd)+"]";
    };
}


/**
 * Encoder && Decoder
 * @constructor
 */
function UmspProtocol() {
    var mUserID = 0;
    var mToken = "";
    var mGameID = 0;
    var mServerID = 0;
    var mRoomID = 0;
    var protocol = this;

    this.setRoomID = function (roomID) {
        this.mRoomID = roomID;
    };

    /**
     *
     * @param {Uint8Array} dataArray
     * @param cmd {int}
     * @returns {DataView}
     */
    this.fillHeader = function (dataArray, cmd) {
        var length = (dataArray ? dataArray.length : 0);
        var buffer = new ArrayBuffer(FIXED_HEAD_SIZE + length);
        var dataView = new DataView(buffer);
        dataView.setInt32(0, buffer.byteLength, true);
        dataView.setInt32(4, Number(mRoomID), true);
        dataView.setInt32(8, Number(mUserID), true);
        dataView.setInt32(12, Number(mGameID), true);
        dataView.setInt32(16, Number(mServerID), true);
        dataView.setInt32(20, Number(cmd), true);
        for (var i = 0; i < length; i++) {
            dataView.setUint8(i + FIXED_HEAD_SIZE, dataArray[i]);
        }
        //log.i("[encode] cmd: [" +CmdToString(cmd)+"]" );
        return dataView;
    };
    /**
     *
     * @param msg {DataView}
     * @returns {UmspHeader}
     */
    this.parseHeader = function (msg) {
        var dataView = msg;
        var head = new UmspHeader();
        head.size = dataView.getInt32(0, true);
        head.x = dataView.getInt32(4, true);
        head.userID = dataView.getInt32(8, true);
        head.gameID = dataView.getInt32(12, true);
        head.serviceID = dataView.getInt32(16, true);
        head.cmd = dataView.getInt32(20, true);
        return head;
    };
    /**
     *
     * @param msg {DataView}
     * @returns {Packet}
     */
    this.decode = function (msg) {
        var header = this.parseHeader(msg);
        //log.i("[decode]:"+header);
        var ext = new Uint8Array(header.size - FIXED_HEAD_SIZE);
        for (var i = 0; i < ext.length; i++) {
            ext[i] = msg.getUint8(FIXED_HEAD_SIZE + i);
        }
        header.payload = ext;

        var packet = new Packet();
        packet.header = header;
        packet.buf = msg;
        packet.payload = ext;
        return packet;
    };

    this.Encoders = {};
    this.Encoders[Umsp.HEARTBEAT] = function () {
        return protocol.fillHeader(new Uint8Array(0), Umsp.HEARTBEAT);
    };
    this.Encoders[Umsp.LOGIN] = function (args) {
        mUserID = args[0];
        mToken = args[1];
        mGameID = args[2];
        mServerID = args[3] || 0;
        console.log("[REQ]login...userID:" + mUserID);
        return protocol.fillHeader(stringToUtf8ByteArray(args[2]), Umsp.LOGIN);
    };
    this.Encoders[Umsp.MATCH] = function (args) {
        console.log("[REQ]match...match:" + args[0]);
        return protocol.fillHeader(stringToUtf8ByteArray(JSON.stringify(args[0])), Umsp.MATCH);

    };
    this.Encoders[Umsp.ROOM_ENTER] = function (args) {
        console.log("[REQ]ROOM_ENTER... roomSession:" + args[0]);
        return protocol.fillHeader(stringToUtf8ByteArray(args[0]), Umsp.ROOM_ENTER);

    };
    this.Encoders[Umsp.MSG] = function (args) {
        //console.log("[REQ]ROOM_MSG...:" + args[0]);
        return protocol.fillHeader(stringToUtf8ByteArray(args[0]), Umsp.MSG);
    };
    this.encode = function () {
        var cmd = arguments[0];
        if (!this.Encoders[cmd]) {
            console.warn("Not Found Encoder For " + cmd + " (" + CmdToString(cmd) + ")");
        } else {
            var args = [];
            for (var i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            return this.Encoders[arguments[0]](args);
        }
    };

    this.getRoomList = function (gameID, filter) {

        //todo  getRoomList
    };


    this.stopJoin = function (gameID, roomID, cpProto, userID) {
        //todo  stopJoin
    };

}

/* ================ websocketclient.js ================= */
function NetWorkCallBack() {
}

NetWorkCallBack.prototype.onMsg = function (buf) {
    console.log("[INFO] onMsg ");
};
NetWorkCallBack.prototype.onErr = function (errCode, errMsg) {
    console.log("[INFO] onErr ");
};

/**
 * auto connect when new  client
 * @param host ex:  'host:port/uri?par=xx'
 * @param callback @see NetWorkCallBack
 * @constructor
 */
function WebSocketClient(host, callback) {

    this.socket = null;
    this.mCallBack = callback;
    this.mHost = host;
    var bufQueue = [];
    /**
     * send binary
     * @param message @see DataView
     */
    this.send = function (message) {

        if (!window.WebSocket) {
            return;
        }
        if (isIE()) {
            var uint8A = new Uint8Array(message.buffer.byteLength);
            for (var i = 0; i < uint8A.length; i++) {
                uint8A[i] = (message.getUint8(i));
            }
            message = uint8A;
        }
        if (this.socket.readyState === WebSocket.OPEN) {
            //log(message);
            this.socket.send(message.buffer);
        } else {
            bufQueue.push(message);
        }
    };

    this.close = function () {
        if (this.socket) {
            if (typeof cc !== "undefined" && typeof cc.Component !== "undefined") {
                this.socket.close();
            } else {
                this.socket.close(1000, "");
            }
        }
    };


    if (!window.WebSocket) {
        window.WebSocket = window.MozWebSocket;
    }

    if (window.WebSocket) {
        this.socket = new WebSocket(host);
        this.socket.hashcode = new Date().getMilliseconds();
        console.log("try to create a socket:" + this.mHost + " socket is " + this.socket.hashcode);
        this.socket.onmessage = function (event) {

            if (typeof FileReader !== 'undefined' && (event.data instanceof Blob)) {
                var reader = new FileReader();
                reader.readAsArrayBuffer(event.data);
                //  当读取操作成功完成时调用.
                reader.onload = function (evt) {
                    if (evt.target.readyState === FileReader.DONE) {
                        var dataView = new DataView(reader.result);
                        this.mCallBack.onMsg(dataView);
                    } else {
                        this.mCallBack.onErr(MvsCode.DataParseErr, "[err]parse fail");
                    }
                }.bind(this);
            } else if (event.data instanceof ArrayBuffer) {
                var dataView = new DataView(event.data);
                this.mCallBack.onMsg(dataView);
            } else {
                console.log("[error] unknown event :" + event + " => " + JSON.stringify(event));
                this.mCallBack.onErr(MvsCode.DataParseErr, "[err]parse fail");
            }
        }.bind(this);

        this.socket.onopen = function (event) {
            console.log("Create the socket is success :" + this.mHost + " socket is " + this.socket.hashcode);
            while (bufQueue.length > 0) {
                this.send(bufQueue.pop());
            }
            this.mCallBack.onConnect && this.mCallBack.onConnect(this.mHost);

        }.bind(this);

        this.socket.onclose = function (e) {
            if (typeof cc !== "undefined" && typeof cc.Component !== "undefined") {
                e = {"code": 1000, "reason": "jsb friend close "};
            }
            this.mCallBack.onDisConnect && this.mCallBack.onDisConnect(this.mHost, e);
            console.log("socket on closed ,code:" + JSON.stringify(e) + "(1000:NORMAL,1005:CLOSE_NO_STATUS,1006:RESET,1009:CLOSE_TOO_LARGE)"  );

        }.bind(this);

        this.socket.onerror = function (event) {
            console.log("socket on error ,event:" + JSON.stringify(event));
            this.mCallBack.onDisConnect && this.mCallBack.onDisConnect(this.mHost, event);
        }.bind(this);

    } else {
        console.log("Not Support the WebSocket！");
    }
}


try {
    if (typeof (wx) !== "undefined") {
        HttpClient = function HttpClient(callback) {
            this.mCallback = callback;


            function send(url, callback, isPost, params) {
                wx.request({
                    url: url,
                    data: {
                        x: "",
                        y: ""
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function (res) {
                        var rsp = JSON.stringify(res.data);
                        log.i("http success:" + rsp);
                        callback.onMsg(rsp);
                    },
                    fail: function (res) {
                        log.i("http fail:" + res.errMsg);
                        callback.onErr(0, res.errMsg);
                    }
                });
            }

            this.get = function (url) {
                send(url, this.mCallback, false, null);
            };
            this.post = function (url, params) {
                send(url, this.mCallback, true, params);
            };
        };
    }
    else {
        HttpClient = function HttpClient(callback) {
            this.mCallback = callback;

            function send(url, callback, isPost, params) {
                var http = new XMLHttpRequest();
                http.open(isPost ? "POST" : "GET", url, true);
                http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                http.onreadystatechange = function () {//Call a function when the state changes.
                    if (http.readyState === 4) {
                        if (http.status === 200) {
                            callback.onMsg(http.responseText);
                            log.i("[HTTP:](" + url + ")+" + http.responseText);
                        } else {
                            callback.onErr(http.status, http.statusText);
                        }
                    }
                };
                if (isPost) {
                    http.send(params);
                } else {
                    http.send(null);
                }
            }

            this.get = function (url) {
                send(url, this.mCallback, false, null);
            };
            this.post = function (url, params) {
                send(url, this.mCallback, true, params);
            };
        };
    }


    /**
     *  http client
     * @constructor
     */
    function HttpClient() {
        /**
         * HTTP GET
         * @param url {String} ,ex:'host:port/uri?par=xx'
         */
        this.get = function (url) {
            console.log("[INFO] Not support get ");
        };
        /**
         * HTTP POST
         * @param url {String} ex:'host:port/uri'
         * @param params {String} ex:'lorem=ipsum&name=binny';
         */
        this.post = function (url, params) {
            console.log("[INFO] Not support post ");
        };
    }
} catch (e) {
    console.warn("network adapter warning:" + e.message);
}



/* ================ websocketclientegret.js ================= */
try {
    if (typeof (egret) !== "undefined") {

        WebSocketClient = function WebSocketClient(host, callback) {
            var socket = null;
            var socketOpen = false;
            var socketMsgQueue = [];
            var mCallBack = callback;
            var mHost = host;
            var that = this;
            this.close = function () {
                if (socket) {
                    socket.close();
                }
            };
            /**
             * msg {DataView}
             */
            this.send = function (msg) {

                if (socketOpen) {
                    var byte = new egret.ByteArray();
                    byte.position = 0;
                    var len = msg.buffer.byteLength;
                    for (var i = 0; i < len; i++) {
                        byte.writeByte(msg.getUint8(i));
                    }
                    socket.writeBytes(byte, 0, byte.bytesAvailable);
                } else {
                    //只缓存一百
                    if (socketMsgQueue.length < 100) {
                        socketMsgQueue.unshift(msg);
                    }
                }
            };


            var onOpen = function (res) {
                log.i("[egret.WebSocket][connect]:" + res);
                socketOpen = true;
                while (socketMsgQueue.length > 0) {
                    that.send(socketMsgQueue.pop());
                }

                mCallBack.onConnect && mCallBack.onConnect(mHost);
            };

            var onClose = function (e) {
                socketOpen = false;
                mCallBack.onDisConnect && mCallBack.onDisConnect(0, "wx.onClose", mHost);
                log.i("[egret.WebSocket] [onClose] case:" + JSON.stringify(e));
            };

            var onMessage = function () {
                var byte = new egret.ByteArray();
                socket.readBytes(byte);
                var buffer = new ArrayBuffer(byte.readAvailable);
                var dataView = new DataView(buffer);
                for (var i = 0; i < buffer.byteLength; i++) {
                    dataView.setUint8(i, byte.readUnsignedByte());
                }
                mCallBack.onMsg(dataView);
            };

            var onError = function (event) {
                mCallBack.onErr && mCallBack.onErr(0, "wx.onError", mHost);
                log.i("[egret.WebSocket] [onError] case:" + JSON.stringify(event));
            };

            function connect() {
                socket = new egret.WebSocket();
                socket.type = egret.WebSocket.TYPE_BINARY;
                socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, onMessage, this);
                socket.addEventListener(egret.Event.CONNECT, onOpen, this);
                socket.addEventListener(egret.Event.CLOSE, onClose, this);
                socket.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
                socket.connectByUrl(host);
            }

            connect();
        };
    }
} catch (e) {
    console.warn("network adapter warning:" + e.message);
}/* ================ websocketclientwx.js ================= */

try {
    if (typeof (wx) !== "undefined") {
        WebSocketClient = function WebSocketClient(host, callback) {
            /**
             * WebSocket 任务，可通过 wx.connectSocket() 接口创建返回。
             * @type {socket}
             */
            var socket = null;
            var socketOpen = false;
            var socketMsgQueue = [];
            var mCallBack = callback;
            var mHost = host;
            var that = this;
            this.close = function () {
                if (socket) {
                    socket.close();
                }
            };
            /**
             * msg {DataView}
             */
            this.send = function (msg) {

                if (socketOpen) {
                    socket.send({
                        data: msg.buffer
                    });
                } else {

                    //只缓存一百
                    if (socketMsgQueue.length < 100) {
                        socketMsgQueue.unshift(msg);
                    }
                }
            };


            function connect() {
                socket = wx.connectSocket({
                    url: host,
                    header: {
                        "engine": "WeiXinGame"
                    }
                });
            }

            connect();
            socket.onOpen(function (res) {
                log.i("[wx.WebSocket][connect]:" + res);
                socketOpen = true;
                while (socketMsgQueue.length > 0) {
                    that.send(socketMsgQueue.pop());
                }

                mCallBack.onConnect && mCallBack.onConnect(mHost);
            });

            socket.onClose(function (e) {
                socketOpen = false;
                mCallBack.onDisConnect && mCallBack.onDisConnect(0, "wx.onClose", mHost);
                log.i("[wx.WebSocket] [onClose] case:" + JSON.stringify(e));
            });

            socket.onMessage(function (res) {
                var dataView = new DataView(res.data);
                mCallBack.onMsg(dataView);
            });
            socket.onError(function (event) {
                mCallBack.onErr && mCallBack.onErr(0, "wx.onError", mHost);
                log.i("[wx.WebSocket] [onError] case:" + JSON.stringify(event));
            });
        };
    }
} catch (e) {
    console.warn("network adapter warning:" + e.message);
}



/* ================ umspclient.js ================= */
var ENGINE_ESTATE = {
    STATE_NONE: 0x0000,     //无状态
    STATE_HAVE_INIT: 0x0001,     //初始化
    STATE_HAVE_LOGIN: 0x0004,     //登录
    STATE_IN_ROOM: 0x0008     //在房间内
};

function UmspMsgReceiver(_engine) {
    var self = this;
    var engine = _engine;
    this.onMsg = function (dataView) {
        var packet = engine.mProtocol.decode(dataView);
        if (packet && packet.header) {
            //try {
            //    console.log("[Receive] cmd:" + CmdToString(packet.header.cmd) + " size:" + packet.header.size);
            //} catch (e) {
            //    console.warn(e);
            //}
            if (self[packet.header.cmd]) {
                self[packet.header.cmd](packet);
            } else {
                console.warn("No Handler to handle cmd:" + CmdToString(packet.header.cmd));
            }
        } else {
            console.error("packet unpack fail dataView:" + dataView);
        }

    };
}


function UmspClient() {

    this.mProtocol = new UmspProtocol();
    this.mRoomID = 0;
    this.mUserID = 0;
    this.mGameID = 0;
    this.mGateWayNetWork = null;
    this.mRoomNetWork = null;
    var gateWayMsgReceiver;
    var roomServerMsgReceiver;
    /**
     * 登录
     * @userID {uint32} value 用户ID
     * @token {uint64} value 用户的token值
     * @gameID {uint32} gameID 游戏ID
     * @cb   {func} onSuccess(data),onErr(errCode,errInfo) }
     * @gateWayNetWorkListener   {func} onSuccess(data),onErr(errCode,errInfo) }
     * @envir {uint16} localhost/Dev
     */
    this.login = function (userID, token, gameID, cb, gateWayNetWorkListener, envir) {
        this.disConnect();
        this.mConfig = getHostConfig(envir || ServerConfig.Erdanger);
        gateWayMsgReceiver = new UmspMsgReceiver(this);
        log.i("login to " + JSON.stringify(this.mConfig));
        // if(this.mGateWayNetWork!==null){
        //     this.mGateWayNetWork.close();
        // }
        gateWayMsgReceiver[Umsp.LOGIN_RSP] = cb;
        gateWayMsgReceiver[Umsp.HEARTBEAT] = function () {
            log.i("[Rsp][GateWayHeartBeat]");
        };
        //在连接建立时,增加心跳定时器
        this.heartBeatGateWay = this.heartBeatGateWay.bind(this);
        var gateWayTimer;
        var engine = this;
        gateWayMsgReceiver.onConnect = function (host) {
            gateWayTimer = setInterval(engine.heartBeatGateWay, HEART_BEAT_INTERVAL);
            gateWayNetWorkListener && gateWayNetWorkListener.onConnect && gateWayNetWorkListener.onConnect(host);
        };
        gateWayMsgReceiver.onErr = function (errCode, errMsg, host) {
            gateWayNetWorkListener && gateWayNetWorkListener.onErr && gateWayNetWorkListener.onErr(errCode, errMsg, host);
        };

        gateWayMsgReceiver.onDisConnect = function (errCode, errMsg, host) {
            clearInterval(gateWayTimer);
            log.i("remove the gateWayTimer:" + gateWayTimer);
            gateWayNetWorkListener && gateWayNetWorkListener.onDisConnect && gateWayNetWorkListener.onDisConnect(errCode, errMsg, host);
        };

        // noinspection JSCheckFunctionSignatures
        this.mGateWayNetWork = new WebSocketClient(this.mConfig.HOST_GATWAY_ADDR, gateWayMsgReceiver);
        this.mUserID = userID;
        this.mGameID = gameID;
        this.mGateWayNetWork.send(this.mProtocol.encode(Umsp.LOGIN, this.mUserID, token, this.mGameID));
    };


    this.match = function (matchResultListener, roomUserChangedListener, roomServiceNetWorkListener,roomMsgListener,match) {


        gateWayMsgReceiver[Umsp.MATCH_RSP] = function (rsp) {
            matchResultListener(rsp);
            var matchResult = JSON.parse(utf8ByteArrayToString(rsp.payload));
            if (matchResult["isSuccess"] === true) {
                log.i("match is success , the next step is  enter the room");

                var room = matchResult["room"];
                var url = room["roomURL"] ? ("ws://" + room["roomURL"]) : ("ws://" + room["roomIP"] + ":" + room["roomPort"]);
                roomServerMsgReceiver = new UmspMsgReceiver(this);
                roomServerMsgReceiver[Umsp.ROOM_USER_CHANGED] = roomUserChangedListener;
                roomServerMsgReceiver[Umsp.HEARTBEAT] = function () {
                    log.i("[Rsp][RoomServiceHeartBeat]");
                };


                //在连接建立时,增加心跳定时器
                this.heartBeatRoomService = this.heartBeatRoomService.bind(this);
                var timer;
                var engine = this;
                roomServerMsgReceiver.onConnect = function (host) {
                    timer = setInterval(engine.heartBeatRoomService, HEART_BEAT_INTERVAL);
                    roomServiceNetWorkListener && roomServiceNetWorkListener.onConnect && roomServiceNetWorkListener.onConnect(host);
                };
                roomServerMsgReceiver.onErr = function (errCode, errMsg, host) {
                    roomServiceNetWorkListener && roomServiceNetWorkListener.onErr && roomServiceNetWorkListener.onErr(errCode, errMsg, host);
                };

                roomServerMsgReceiver.onDisConnect = function (errCode, errMsg, host) {
                    clearInterval(timer);
                    log.i("onDisConnect,remove the timer:" + timer);
                    roomServiceNetWorkListener && roomServiceNetWorkListener.onDisConnect && roomServiceNetWorkListener.onDisConnect(errCode, errMsg, host);
                };
                roomServerMsgReceiver[Umsp.MSG_RSP] = function (rsp) {
                    roomMsgListener&&roomMsgListener(utf8ByteArrayToString(rsp.payload));
                };
                this.mRoomNetWork = new WebSocketClient(url, roomServerMsgReceiver);
                this.mRoomID = matchResult["room"]["roomID"];
                var roomSession = matchResult["room"]["session"];
                this.mProtocol.setRoomID(this.mRoomID);
                return this.mRoomNetWork.send(
                    this.mProtocol.encode(
                        Umsp.ROOM_ENTER, ""+roomSession));
            }else{
                log.e("match fail");
            }


        }.bind(this);
        return this.mGateWayNetWork.send(
            this.mProtocol.encode(
                Umsp.MATCH, match||new Match(Match.prototype.RANDOM)
            )
        );
    };
    this.heartBeatGateWay = function () {
        this.mGateWayNetWork.send(this.mProtocol.encode(Umsp.HEARTBEAT));
    };
    this.heartBeatRoomService = function () {
        this.mRoomNetWork.send(this.mProtocol.encode(Umsp.HEARTBEAT));
    };
    this.getVersion = function () {
        return "Umsp-SDK-JS_v0.0.2.20180713";
    };
    this.disConnect = function () {
        console.log("Want to  close the connection");
        this.mGateWayNetWork&&this.mGateWayNetWork.close();
        this.mRoomNetWork&&this.mRoomNetWork.close();
    };
    this.broadcast = function (data) {
        if (typeof data != 'string') {
            data = JSON.stringify(data);
        }
        this.mRoomNetWork.send(this.mProtocol.encode(Umsp.MSG, data));
    };
}


try {
  if (module && module.exports) {
     module.exports = { User, Match};
	}  
} catch (error) {
    console.log(error);
}

window.User  = User ;
window.Match  = Match ;


