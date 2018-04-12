---
---

{% include_relative _vendor/vue.2.5.16.js %}
{% include_relative _vendor/vue-vimeo-player.0.0.6.js %}
{% include_relative _vendor/vue-youtube-embed.2.1.3.js %}
{% include_relative _vendor/blazy.1.8.2.js %}

{% include_relative Component.js %}
{% include_relative _components/Scroll.js %}
{% include_relative _components/ImageInline.js %}
{% include_relative _components/ImageBackground.js %}
{% include_relative _components/Embed.js %}
{% include_relative _components/ProgressBar.js %}
{% include_relative _components/Paginator.js %}
{% include_relative _components/Gallery.js %}

Vue.use(VueYouTubeEmbed.default)

// $('.column').each(function () {
//   var $el = $(this)
//   new ScrollMagic.Scene({
//     triggerElement: this,
//     triggerHook: 'onEnter'
//   })
//     .on('enter', function (e) {
//       $el.addClass('enter')
//     })
//     .on('leave', function (e) {
//       $el.removeClass('enter')
//     })
//     .addTo(controller)
// })

var bLazy = new Blazy({
  // Options
})

// $('a').click(function (e) {
//   var href = $(this).attr('href')
//   if (href && href[0] === '/') {
//     e.preventDefault()
//     $('body').removeClass('enter')
//     setTimeout(function () {
//       window.location.href = href
//     }, 500)
//   }
// })
//
// setTimeout(function () {
//   $('body').addClass('enter')
// }, 100)

function loadJsAsync(src, onLoadStart, onLoaded) {
  if(!window.async_js_src) window.async_js_src = {}
  if(window.async_js_src[src]) {
    if(window.async_js_src[src].loaded) {
      onLoaded()
    } else {
      window.async_js_src[src].callbacks.push(onLoaded)
    }
    return
  }
  window.async_js_src[src] = {
    loaded: false,
    callbacks: [onLoaded]
  }
  if(onLoadStart) onLoadStart(function() {
    window.async_js_src[src].loaded = true
    for(var i = 0; i < window.async_js_src[src].callbacks.length; i++) {
      window.async_js_src[src].callbacks[i]()
    }
  })
  var tag = document.createElement('script')
  tag.src = src
  var firstScriptTag = document.getElementsByTagName('script')[0]
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
}

function loadImages(el) {
  bLazy.load(el.getElementsByClassName('image-img'))
}

function initiateVueComponents (component, f) {
  var nodes = document.getElementsByClassName('component-type-' + component)
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i]
    var data = node.attributes['data-data'] && JSON.parse(node.attributes['data-data'].value) || {}
    var attrs = node.attributes
    for(var j = 0; j < attrs.length; j++) {
      var attr = attrs[j]
      if(attr.name !== 'data-data') {
        var match = attr.name.match(/^data\-(.*?)$/)
        if(match) {
          data[match[1]] = JSON.parse(attr.value)
        }
      }
    }
    node.innerHTML = `<${component} v-bind="props"/>`
    new Vue({
      el: node,
      data: {props: data}
    })
  }
}

initiateVueComponents('gallery')
initiateVueComponents('embed-inline')
