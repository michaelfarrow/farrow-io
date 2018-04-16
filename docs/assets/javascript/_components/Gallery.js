;(function () {
  ExtendComponent('scroll', 'gallery', {
    props: {
      root: {
        type: String,
        required: true
      },
      images: {
        type: Array,
        required: true
      },
      duration: {
        type: Number,
        default: 5
      }
    },
    data: function () {
      return {
        current: 0,
        peak: 0,
        progress: 0
      }
    },
    computed: {
      imagePaths: function () {
        var imageRoot = this.root
        return this.images.map(function (image) {
          return imageRoot + image
        })
      },
      contentLeft: function () {
        var offset = this.canNavigate(this.peak) ? this.peak : 0
        return `translateX(${ offset * -2.5 }em)`
      },
      innerLeft: function () {
        return `translateX(${ this.current * -100 }%)`
      }
    },
    methods: {
      loadSlides: function () {
        loadImages(this.$el)
      },
      slideLeft: function (index) {
        return `${index * 100}%`
      },
      canNavigate: function (dir) {
        var next = this.current + dir
        return next >= 0 && next < this.images.length
      },
      navigate: function (dir) {
        if (this.canNavigate(dir)) {
          this.current += dir
          this.interacted = true
        }
      },
      peakIn: function (dir) {
        this.peak = dir
      },
      peakOut: function () {
        this.peak = 0
      },
      autoAdvance: function () {
        if (this.interacted) return
        if (!this.canNavigate(this.autoDir)) this.autoDir = this.autoDir > 0 ? -1 : 1
        this.current += this.autoDir
      },
      onTick: function () {
        const duration = this.duration * 1000
        let nextTickCurrent = this.tickCurrent += this.tick
        if (nextTickCurrent >= duration) {
          if (!this.canNavigate(this.autoDir)) this.autoDir = this.autoDir > 0 ? -1 : 1
          this.current += this.autoDir
          nextTickCurrent = 0
        }
        this.tickCurrent = nextTickCurrent
        this.progress = (this.current + this.tickCurrent / duration) / this.images.length
      // const end = this.duration * 1000 * this.images.length
      // let nextTickCurrent = this.tickCurrent + this.tick * this.autoDir
      // if (nextTickCurrent < 0) {
      //   nextTickCurrent = 0
      //   this.autoDir = 1
      // }
      // if (nextTickCurrent > end) {
      //   nextTickCurrent = end
      //   this.autoDir = -1
      // }
      // this.tickCurrent = nextTickCurrent
      // this.current = Math.floor(this.tickCurrent / duration)
      },
      onScrollEnter: function () {
        if (this.interval) return
        this.interval = setInterval(this.autoAdvance, this.duration * 1000)
        this.loadSlides()
      }
    },
    beforeCreate: function () {
      this.interacted = false
      this.autoDir = 1
    // this.tick = 100
    // this.tickCurrent = 0
    },
    template: `
      <div class="gallery noselect">
        <div class="gallery-inner" :style="{ transform: innerLeft }">
          <ul class="gallery-content" :style="{ transform: contentLeft }">
            <li class="gallery-slide" v-for="(image, index) in imagePaths" :style="{ left: slideLeft(index) }">
              <span class="gallery-slide-inner">
                <image-background :src="image" />
              </span>
            </li>
          </ul>
        </div>
        <paginator :current="current + 1" :total="images.length" />
        <div class="gallery-nav gallery-nav-prev" :class="{'gallery-nav-active': canNavigate(-1)}" @click="navigate(-1)" @mouseenter="peakIn(-1)" @mouseleave="peakOut"></div>
        <div class="gallery-nav gallery-nav-next" :class="{'gallery-nav-active': canNavigate(1)}" @click="navigate(1)" @mouseenter="peakIn(1)" @mouseleave="peakOut"></div>
      </div>
    `
  })
})()
