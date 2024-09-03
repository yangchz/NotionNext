/* eslint-disable */
import { siteConfig } from '@/lib/config'
let bszCaller, bszTag, scriptTag, ready

let t; let e; let n; let a = !1
let c = []

// 修复Node同构代码的问题
if (typeof document !== 'undefined') {
  ready = function (t) {
    return a || document.readyState === 'interactive' || document.readyState === 'complete'
      ? t.call(document)
      : c.push(function () {
        return t.call(this)
      }), this
  }, e = function () {
    for (let t = 0, e = c.length; t < e; t++) c[t].apply(document)
    c = []
  }, n = function () {
    a || (a = !0, e.call(window),
    document.removeEventListener ? document.removeEventListener('DOMContentLoaded', n, !1) : document.attachEvent && (document.detachEvent('onreadystatechange', n), window == window.top && (clearInterval(t), t = null)))
  }, document.addEventListener
    ? document.addEventListener('DOMContentLoaded', n, !1)
    : document.attachEvent && (document.attachEvent('onreadystatechange', function () {
      /loaded|complete/.test(document.readyState) && n()
    }), window == window.top && (t = setInterval(function () {
      try {
        a || document.documentElement.doScroll('left')
      } catch (t) {
        return
      }
      n()
    }, 5)))
}

bszCaller = {
  fetch: function (t, e) {
    const n = 'BusuanziCallback_' + Math.floor(1099511627776 * Math.random())
    t = t.replace('=BusuanziCallback', '=' + n)
    scriptTag = document.createElement('SCRIPT'), scriptTag.type = 'text/javascript', scriptTag.defer = !0, scriptTag.src = t, scriptTag.referrerPolicy = "no-referrer-when-downgrade", document.getElementsByTagName('HEAD')[0].appendChild(scriptTag)
    window[n] = this.evalCall(e)
  },
  evalCall: function (e) {
    return function (t) {
      ready(function () {
        try {
          e(t)
          if (scriptTag && scriptTag.parentElement && scriptTag.parentElement.contains(scriptTag)) {
            scriptTag.parentElement.removeChild(scriptTag)
          }
        } catch (t) {
         // console.log(t), bszTag.hides()
        }
      })
    }
  }
}

const umamiCaller = {
  fetch: function (callback) {
    const baseUrl = siteConfig('UMAMI_SCRIPT_URL')?.split("/").slice(0, -1).join("/")
    const websiteId = siteConfig('UMAMI_WEBSITE_ID')
    const token = siteConfig('UMAMI_TOKEN')
    const data = {
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    };
    const startAt = new Date("2024-04-10").getTime();
    const endAt = new Date().getTime();
    const url = `${baseUrl}/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`;
    if (siteConfig("UMAMI_ENABLED") && baseUrl && websiteId && token) {
      fetch(url, data).then(response => {
        if (!response.ok) { return; }
        response.json().then(data => {
          let ret = {'site_pv': 0, 'page_pv': 0, 'site_uv': 0}
          if (data.pageviews && data.pageviews.value) {
            ret['site_pv'] = data.pageviews.value;
          }
          if (data.pageviews && data.visitors.value) {
            ret['site_uv'] = data.visitors.value;
          }
          callback(ret);
        });
      });
    }
  }
}

const _fetch = () => {
  bszTag && bszTag.hides()
  // bszCaller.fetch('//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback', function (t) {
  umamiCaller.fetch(function (t) {
    // console.log('不蒜子',t)
    bszTag.texts(t), bszTag.shows()
  })
}

bszTag = {
  bszs: ['site_pv', 'page_pv', 'site_uv'],
  texts: function (n) {
    this.bszs.map(function (t) {
      const e = document.getElementsByClassName('busuanzi_value_' + t)
      if(e){
        for (var element of e) {
          element.innerHTML = n[t]
        }
      }
    })
  },
  hides: function () {
    this.bszs.map(function (t) {
      const e = document.getElementsByClassName('busuanzi_container_' + t)
      if(e){
        for (var element of e){
          element.style.display = 'none'
        }
      }
    })
  },
  shows: function () {
    this.bszs.map(function (t) {
      const e = document.getElementsByClassName('busuanzi_container_' + t)
      if(e){
        for(var element of e){
          element.style.display = 'inline'
        }
      }
    })
  }
}

module.exports = {
  fetch: _fetch,
}
