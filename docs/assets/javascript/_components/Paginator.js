;(function () {
  Component('paginator', {
    props: {
      total: {
        type: Number,
        required: true
      },
      current: {
        type: Number,
        required: true
      }
    },
    methods: {
      isCurrent: function (index) {
        return this.current === index
      }
    },
    template: `
      <div class="paginator">
        <ul>
          <li v-for="index in total" :class="{'paginator-current': isCurrent(index)}">
            <span><span>[[ index ]]</span></span>
          </li>
        </ul>
      </div>
    `
  })
})()
