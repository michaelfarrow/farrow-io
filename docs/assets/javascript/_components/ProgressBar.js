Component('progress-bar', {
  props: {
    progress: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      default: 0
    }
  },
  computed: {
    progressWidth: function () {
      return `${this.progress * 100}%`
    },
    progressDuration: function () {
      return `${this.duration}s`
    }
  },
  template: `
    <span class="progress-bar">
      <span class="progress-bar-progress" :style="{width: progressWidth, transitionDuration: progressDuration}"></span>
    </span>
  `
})
