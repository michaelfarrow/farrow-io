---
---

{% include_relative _vendor/vue-router.3.0.1.js %}
{% include_relative _vendor/vue-autosuggest.1.4.1.js %}
{% include_relative _vendor/vue-vimeo-player.0.0.6.js %}
{% include_relative _vendor/vue-youtube-embed.2.1.3.js %}

{% include_relative _vendor/blazy.1.8.2.js %}
{% include_relative _vendor/fuse.3.0.4.js %}

{% include_relative Component.js %}
{% include_relative _components/Scroll.js %}
{% include_relative _components/ImageInline.js %}
{% include_relative _components/ImageBackground.js %}
{% include_relative _components/Embed.js %}
{% include_relative _components/ProgressBar.js %}
{% include_relative _components/Paginator.js %}
{% include_relative _components/Gallery.js %}
{% include_relative _components/Work.js %}
{% include_relative _components/Search.js %}

Vue.use(VueYouTubeEmbed.default)
Vue.use(VueAutosuggest)

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

function getData (node, json) {
  json = json === undefined ? false : json
  // var data = node.attributes['data-data'] && JSON.parse(node.attributes['data-data'].value) || {}
  var data = {}
  var attrs = node.attributes
  for(var j = 0; j < attrs.length; j++) {
    var attr = attrs[j]
    var match = attr.name.match(/^data\-(.*?)$/)
    if(match) {
      data[match[1].replace(/\-/g, '_')] = json ? JSON.parse(attr.value) : attr.value
    }
  }
  return data
}

function initiateVueComponents (component) {
  var nodes = document.getElementsByClassName('component-type-' + component)
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i]
    var data = getData(node, true)
    node.innerHTML = `<${component} v-bind="props"/>`
    new Vue({
      el: node,
      data: {props: data}
    })
  }
}

function initiateVueComponentsPE(parentId, children) {
  // var parent = document.getElementById(parentId)
  // if(!parent) return
  // var rootComponent = document.createElement('div')
  // var wrapper = document.createElement(parentId)
  // for (var i = 0; i < children.length; i++) {
  //   var child = children[i]
  //   var nodes = parent.getElementsByClassName(child)
  //   for (var j = 0; j < nodes.length; j++) {
  //     var node = nodes[j]
  //     var component = document.createElement(child)
  //     var attr
  //     var attributes = Array.prototype.slice.call(node.attributes)
  //     while(attr = attributes.pop()) {
  //       component.setAttribute(attr.nodeName, attr.nodeValue);
  //     }
  //     component.innerHTML = node.innerHTML
  //     node.parentNode.replaceChild(component, node)
  //   }
  // }
  // parent.parentNode.insertBefore(rootComponent, parent.nextSibling);
  // wrapper.appendChild(parent)
  // rootComponent.appendChild(wrapper)
  // // parent.innerHTML = `<${parentId}><div>${parent.innerHTML}</div></${parentId}>`
  // new Vue({
  //   el: rootComponent
  // })
}

function withElements (className, f) {
  var nodes = document.getElementsByClassName(className)
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i]
    var data = getData(node)
    f(node, data)
  }
}

initiateVueComponents('gallery')
initiateVueComponents('embed-inline')
// initiateVueComponents('search')

// initiateVueComponentsPE('work-items', ['work-item'])

// var work = []
// withElements('work-item', function(node, data) {
//   work.push({
//     node: node,
//     data: data
//   })
// })
// console.log(work)

// var work = document.getElementById('work-items')
// var workWrapper = document.createElement('div')
//
// work.parentNode.insertBefore(workWrapper, work.nextSibling)
// workWrapper.appendChild(work)
//
// var workHtml = workWrapper.innerHTML
// workWrapper.innerHTML = `
//   <div>
//     <div>
//       <router-link to="/foo">Go to Foo</router-link>
//       <router-link to="/bar">Go to Bar</router-link>
//     </div>
//     <div>
//       <search v-model="search" :suggestions="suggestions" @input="onInput" />
//     </div>
//     <div> test [[ search ]]</div>
//     <div>
//       ${workHtml}
//     </div>
//   </div>
// `

// var routes = [
//   { path: '/foo', component: Foo },
//   { path: '/bar', component: Bar }
// ]
//
// var router = new VueRouter({
//   routes: routes
// })
//

// new Vue({
//   delimiters: ['[[', ']]'],
//   // router: router,
//   el: workWrapper,
//   data: {
//     search: '',
//     work: [],
//     suggestions: []
//   },
//   methods: {
//     itemVisible: function(index) {
//       var work = this.work[index]
//       if(!work) return true
//       return work.visible
//     },
//     onInput: function(search) {
//       search = search.trim()
//       if(search.length) {
//         var result = this.fuse.search(search)
//         var indexes = []
//         for(var i = 0; i < result.length; i++) {
//           indexes.push(result[i].index)
//         }
//         for(var i = 0; i < this.work.length; i++) {
//           this.$set(this.work[i], 'visible', indexes.includes(this.work[i].index));
//         }
//       } else {
//         for(var i = 0; i < this.work.length; i++) {
//           this.$set(this.work[i], 'visible', true);
//         }
//       }
//     }
//   },
//   mounted: function() {
//     var work = []
//     var dataTitles = []
//     var dataFor = []
//     var dataResponsibleFor = []
//     var nodes = this.$el.getElementsByClassName('work-item')
//     for (var i = 0; i < nodes.length; i++) {
//       var node = nodes[i]
//       var data = getData(node)
//       if(!dataTitles.includes(data.title)) dataTitles.push(data.title)
//       if(!dataFor.includes(data.for)) dataFor.push(data.for)
//       var responsible_for = (data.responsible_for || '').split(/\s*,\s*/g)
//       for(var j = 0; j < responsible_for.length; j++) {
//         var rfi = responsible_for[j]
//         if(!dataResponsibleFor.includes(rfi)) dataResponsibleFor.push(rfi)
//       }
//       work.push({
//         index: i,
//         data: data,
//         visible: true
//       })
//     }
//     this.work = work
//     this.suggestions = {
//       title: {
//         label: 'Title',
//         suggestions: dataTitles
//       },
//       for: {
//         label: 'Agency',
//         suggestions: dataFor
//       },
//       responsible_for: {
//         label: 'Discipline',
//         suggestions: dataResponsibleFor
//       }
//     }
//     var options = {
//       // shouldSort: true,
//       // threshold: 0.6,
//       // location: 0,
//       // distance: 100,
//       // maxPatternLength: 32,
//       // minMatchCharLength: 1,
//       keys: [
//         "data.title",
//         "data.for",
//         "data.responsible_for"
//       ]
//     }
//     this.fuse = new Fuse(work, options)
//   }
// })
