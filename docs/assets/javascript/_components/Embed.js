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
      },
      autoPlay: {
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
        if(!this.background) EventBus.$emit('play', this)
        this.$emit('play')
      },
      onPause: function () {
        if(!this.background) EventBus.$emit('pause', this)
        this.$emit('pause')
      },
      onEnded: function () {
        if(!this.background) EventBus.$emit('ended', this)
        this.$emit('ended')
      },
      onEventBusPlay: function (c) {
        if (!this.background && c !== this) this.pause()
      },
      pause: function () {},
      play: function () {},
      stop: function () {}
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
        if(this.autoPlay && !this.background) this.play()
      },
      _onEnded: function() {
        if(!this.background) this.stop()
        this.onEnded()
      },
      pause: function () {
        this.player.pauseVideo()
      },
      play: function () {
        this.player.playVideo()
      },
      stop: function () {
        this.player.stopVideo()
      }
    },
    template: `<youtube :video-id="id" :player-vars="playerOptions" :mute="background" @ready="onReady" @playing="onPlay" @paused="onPause" @ended="_onEnded" />`
  })

  ExtendComponent('embed-base', 'embed-vimeo', {
    computed: {
      playerOptions: function () {
        return {
          quality: '720p',
          title: 0,
          byline: 0,
          portrait: 0,
          background: this.background ? 1 : 0,
          transparent: 1,
          autoplay: this.autoPlay ? 1 : 0
        }
      }
    },
    data: function(){
      return {
        playing: false
      }
    },
    methods: {
      onReady: function (player) {
        this.player = player
      },
      onTimeUpdate: function(e) {
        if(this.playing && e.seconds > 0.25) {
          this.onPlay()
        }
      },
      _onPlay: function() {
        this.playing = true
      },
      _onPause: function() {
        this.playing = false
        this.onPause()
      },
      pause: function () {
        this.$refs.player.pause()
      },
      play: function () {
        this.$refs.player.play()
      },
      stop: function () {
        this.playing = false
        this.$refs.player.stop()
      }
    },
    template: `<vimeo-player ref="player" :video-id="id" :options="playerOptions" @play="_onPlay" @timeupdate="onTimeUpdate" @ended="onEnded" @pause="_onPause" />`
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
      image: {
        type: String
      },
      background_colour: {
        type: String,
        default: 'transparent'
      }
    },
    data: function() {
      return {
        load: false,
        loaded: false,
        playing: false
      }
    },
    methods: {
      onPlay: function() {
        console.log('onPLay')
        this.loaded = true
        this.playing = true
      },
      onPause: function() {
        this.playing = false
      },
      onEnded: function() {
        this.load = false
        this.loaded = false
        this.playing = false
      },
      onImageClick: function() {
        if(this.loaded) {
          return this.$refs.player.play()
        }
        this.load = true
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
      <div class="embed-wrapper" :style="{backgroundColor: background_colour}">
        <div class="embed-inner" :style="{paddingTop: embedPadding}">
          <div v-if="background || load" class="embed-component">
            <component ref="player" :is="providerComponentName" :id="id" :background="background" :autoPlay="!!image || background" @play="onPlay" @pause="onPause" @ended="onEnded" />
          </div>
          <div class="embed-cover-image" v-if="image && !playing"  @click="onImageClick">
            <image-background :src="image" />
            <span class="embed-controls-button" v-if="!background">
              <span class="embed-controls-control">
                <span v-if="!load || (loaded && !playing)" class="embed-controls-play" />
                <span v-else class="embed-controls-loading" />
              </span>
            </span>
          </div>
        </div>
      </div>
    `
  })
})()

// :class="{ 'embed-component': true, 'embed-component-background': background, 'embed-component-playing': shouldPlay }"

/*
Stopped:      icon:play, image:src
Loading:      icon:loading, image:src
Playing       all hidden
Paused:       icon:play, image:null
*/

{/* <div :class="{'embed-cover-image': true, 'embed-cover-image-visible': image && !shouldPlay}" @click="onImageClick" >
  <image-background :src="image" />
  <span class="embed-controls-button" v-if="!background">
    <span class="embed-controls-control">
      <span v-if="!load" class="embed-controls-play" />
      <span v-else class="embed-controls-loading" />
    </span>
  </span>
</div> */}
