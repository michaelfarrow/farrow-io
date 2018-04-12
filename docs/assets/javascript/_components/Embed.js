;(function () {
  var EventBus = new Vue()

  ExtendComponent('scroll', 'embed-base', {
    props: {
      id: {
        required: true
      },
      background: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      playerOptions: function () {
        return {}
      }
    },
    methods: {
      onScrollLeave: function () {
        if (!this.background) this.pause()
      },
      onPlay: function () {
        EventBus.$emit('play', this)
      },
      onEventBusPlay: function (c) {
        if (!this.background && c !== this) this.pause()
      },
      pause: function () {}
    },
    created: function () {
      EventBus.$on('play', this.onEventBusPlay)
    },
    beforeDestroy: function () {
      EventBus.$off('play', this.onEventBusPlay)
    },
    template: ``
  })

  ExtendComponent('embed-base', 'embed-youtube', {
    computed: {
      playerOptions: function () {
        var bg = this.background ? 1 : 0
        return {
          playlist: String(this.id),
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          color: 'white',
          controls: 0,
          loop: bg,
          autoplay: bg
        }
      }
    },
    methods: {
      onReady: function (player) {
        this.player = player
      },
      pause: function () {
        this.player.pauseVideo()
      }
    },
    template: `<youtube :video-id="id" :player-vars="playerOptions" :mute="background" @ready="onReady" @playing="onPlay" />`
  })

  ExtendComponent('embed-base', 'embed-vimeo', {
    computed: {
      playerOptions: function () {
        var bg = this.background ? 1 : 0
        return {
          quality: '720p',
          title: 0,
          byline: 0,
          portrait: 0,
          background: bg,
          transparent: 1
        }
      }
    },
    methods: {
      onReady: function (player) {
        this.player = player
      },
      pause: function () {
        this.$refs.player.pause()
      }
    },
    template: `<vimeo-player ref="player" :video-id="id" :options="playerOptions" @play="onPlay" />`
  })

  ExtendComponent('scroll', 'embed-inline', {
    props: {
      provider: {
        type: String,
        required: true
      },
      id: {
        required: true
      },
      ratio: {
        type: String,
        default: '16:9'
      },
      background: {
        type: Boolean,
        default: false
      },
      backgroundColour: {
        type: String,
        default: 'black'
      }
    },
    computed: {
      providerComponentName: function () {
        return `embed-${this.provider.toLowerCase().trim()}`
      },
      embedPadding: function () {
        var ratio = this.ratio.split(':')
        var x = parseFloat(ratio[0])
        var y = parseFloat(ratio[1])
        return `${y / x * 100}%`
      }
    },
    template: `
      <div class="embed-wrapper" :style="{backgroundColor: backgroundColour}">
        <div class="embed-inner" :style="{paddingTop: embedPadding}">
          <component :is="providerComponentName" :id="id" :background="background" />
        </div>
      </div>
    `
  })
})()
