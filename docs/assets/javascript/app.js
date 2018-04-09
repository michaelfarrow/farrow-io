---
---

{% include_relative Component.js %}
{% include_relative _components/ImageInline.js %}
{% include_relative _components/ImageBackground.js %}
{% include_relative _components/Embed.js %}
{% include_relative _components/ProgressBar.js %}
{% include_relative _components/Paginator.js %}
{% include_relative _components/Gallery.js %}

var scrollController = new ScrollMagic.Controller({globalSceneOptions: { triggerHook: 'onEnter' }})
//
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

// var embedPlayingClass = 'embed-playing'
// var embedStoppedClass = 'embed-stopped'
//
// var $embedsYouTube = $('.embed-type-youtube')
// var $embedsVimeo = $('.embed-type-vimeo')
//
// var youtubePlayers = []
// var vimeoPlayers = []
//
// function pauseOtherPlayers (player) {
//   youtubePlayers.forEach(function (youtubePlayer) {
//     if (player !== youtubePlayer) youtubePlayer.pauseVideo()
//   })
//   vimeoPlayers.forEach(function (vimeoPlayer) {
//     if (player !== vimeoPlayer) vimeoPlayer.pause()
//   })
// }
//
// if ($embedsYouTube.length) {
//   // Load Youtube API asyncronously
//   var tag = document.createElement('script')
//   tag.src = '//www.youtube.com/player_api'
//   var firstScriptTag = document.getElementsByTagName('script')[0]
//   firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
//
//   function onYouTubePlayerAPIReady () {
//     $embedsYouTube.each(function () {
//       var $embed = $(this).parent()
//       var $playPause = $(this).parent().find('.embed-controls-play-pause')
//       if ($playPause.length) {
//         var player = new YT.Player(this, {
//           events: {
//             onReady: function () {
//               $playPause.click(function (e) {
//                 e.preventDefault()
//                 if (player.getPlayerState() === YT.PlayerState.PLAYING) {
//                   player.pauseVideo()
//                 } else {
//                   player.playVideo()
//                   pauseOtherPlayers(player)
//                 }
//               })
//             },
//             onStateChange: function (event) {
//               if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.BUFFERING) {
//                 $embed.addClass(embedPlayingClass)
//               } else {
//                 $embed.removeClass(embedPlayingClass)
//               }
//               if (event.data === YT.PlayerState.UNSTARTED || event.data === YT.PlayerState.ENDED) {
//                 $embed.addClass(embedStoppedClass)
//               } else {
//                 $embed.removeClass(embedStoppedClass)
//               }
//             }
//           }
//         })
//         youtubePlayers.push(player)
//       }
//     })
//   }
// }
//
// if ($embedsVimeo.length) {
//   $embedsVimeo.each(function () {
//     var $embed = $(this).parent()
//     var $playPause = $(this).parent().find('.embed-controls-play-pause')
//     if ($playPause.length) {
//       var player = new Vimeo.Player(this)
//       vimeoPlayers.push(player)
//       player.on('play', function () {
//         $embed.addClass(embedPlayingClass)
//         $embed.removeClass(embedStoppedClass)
//       })
//       player.on('pause', function () {
//         $embed.removeClass(embedPlayingClass)
//       })
//       player.on('ended', function () {
//         $embed.removeClass(embedPlayingClass)
//         $embed.addClass(embedStoppedClass)
//       })
//       $playPause.click(function (e) {
//         e.preventDefault()
//         player.getEnded()
//           .then(function (ended) {
//             return player.getPaused()
//               .then(function (paused) {
//                 return {
//                   ended: ended,
//                   paused: paused
//                 }
//               })
//           })
//           .then(function (info) {
//             if (info.ended || info.paused) {
//               player.play()
//               pauseOtherPlayers(player)
//             } else {
//               player.pause()
//             }
//           })
//       })
//     }
//   })
// }

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
