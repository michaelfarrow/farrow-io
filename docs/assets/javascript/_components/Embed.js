var embed_players = []

function embed_players_pause_others (player) {
  for (var i = 0; i < embed_players.length; i++) {
    var embedPlayer = embed_players[i].instance
    if (!embedPlayer.background && embedPlayer.player !== player) {
      embedPlayer.pause()
    }
  }
}

Component('embed-inline', {
  props: {
    src: {
      type: String,
      required: true
    },
    ratio: {
      type: String,
      default: '16:9'
    },
    image: {
      type: String
    },
    background: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      apiLoaded: false
    }
  },
  computed: {
    embedConfig: function () {
      for (var i = 0; i < this.types.length; i++) {
        var type = this.types[i]
        if (this.src.match(type.regex)) return type
      }
      return null
    },
    embedPadding: function () {
      var ratio = this.ratio.split(':')
      var x = parseFloat(ratio[0])
      var y = parseFloat(ratio[1])
      return `${y / x * 100}%`
    },
    embedSrc: function () {
      var src = this.src
      var config = this.embedConfig
      if (!config) return src
      src = config.src(src)
      src += config.append
      if (this.background) src += config.background
      return src
    }
  },
  methods: {
    loadApi: function () {
      var that = this
      var config = this.embedConfig
      if (config) {
        loadJsAsync(config.api, config.onApiLoadStart, function () {
          that.apiLoaded = true
        })
      }
    },
    createPlayer: function () {
      var iframe = this.$refs.iframe
      if (!iframe) return
      var thisPlayer = null
      for (var i = 0; i < embed_players.length; i++) {
        var player = embed_players[i]
        if (player.$el === this.$el) {
          thisPlayer = player
          break
        }
      }
      if (!thisPlayer) {
        thisPlayer = {
          $el: this.$el,
          iframe: iframe,
          background: this.background
        }
        embed_players.push(thisPlayer)
      }
      if (thisPlayer.instance) thisPlayer.instance.destroy()
      var config = this.embedConfig
      if (config) {
        var instance = config.createPlayer(iframe, function () {
          embed_players_pause_others(instance.player)
        })
        thisPlayer.instance = instance
      }
    }
  },
  beforeCreate: function () {
    this.types = [
      {
        type: 'vimeo',
        api: 'https://player.vimeo.com/api/player.js',
        onApiLoadStart: function (callback) {
          var interval = setInterval(function () {
            if (window.Vimeo !== undefined) {
              clearInterval(interval)
              callback()
            }
          }, 100)
        },
        regex: /vimeo\.com/i,
        src: function (src) {
          return src.replace(/vimeo\.com/i, 'player.vimeo.com/video')
        },
        append: '?quality=720p&title=0&byline=0&portrait=0',
        background: '&background=1',
        createPlayer: function (iframe, onPlay) {
          var player = new Vimeo.Player(iframe)
          player.on('play', onPlay)
          return {
            player: player,
            destroy: function () { player.destroy() },
            play: function () { player.play() },
            pause: function () { player.pause() }
          }
        }
      },
      {
        type: 'youtube',
        api: '//www.youtube.com/player_api',
        onApiLoadStart: function (callback) {
          window.onYouTubePlayerAPIReady = function () {
            callback()
          }
        },
        regex: /youtube/i,
        src: function (src, background) {
          return src.replace(/watch\?v=/i, 'embed/')
        },
        append: '?modestbranding=1&rel=0&showinfo=0&color=white&controls=0&enablejsapi=1',
        background: '&loop=1&autoplay=1&mute=1',
        createPlayer: function (iframe, onPlay) {
          var player = new YT.Player(iframe, {
            events: {
              onStateChange: function (event) {
                if (event.data === YT.PlayerState.PLAYING) {
                  onPlay()
                }
              }
            }
          })
          return {
            player: player,
            destroy: function () { player.destroy() },
            play: function () { player.playVideo() },
            pause: function () { player.pauseVideo() }
          }
        }
      }
    ]
  },
  created: function () {
    this.loadApi()
  },
  updated: function () {
    this.createPlayer()
  },
  mounted: function () {
    this.createPlayer()
  },
  template: `
    <div class="embed-wrapper">
      <div class="embed-inner" :style="{paddingTop: embedPadding}">
        <iframe v-if="apiLoaded" ref="iframe" :src="embedSrc" frameborder="0" allow="autoplay; encrypted-media" allow></iframe>
      </div>
    </div>
  `
})

// <image-background v-if="image" :src="image" />
