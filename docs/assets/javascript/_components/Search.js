;(function () {
  Component('search', {
    props: {
      value: {},
      suggestions: {
        default: function() {
          return ['']
        }
      },
      searchFields: {
        type: Array
      },
      sections: {
        type: Object,
        default: function() {
          var onSelected = this.onSelected
          return {
            default: {
              limit: 5,
              onSelected: onSelected
            }
          }
        }
      }
    },
    data: function() {
      return {
        filteredSuggestions: [],
        inputProps: {
          id: 'autosuggest__input',
          initialValue: this.value,
          autocomplete: 'off',
          // onClick:  this.clickHandler,
          onInputChange:  this.onInputChange,
          // placeholder: 'Donuts, yum!',
          class: 'form-control'
        }
      }
    },
    computed: {
      sectionConfigs: function() {
        var suggestions = this.suggestions
        if(suggestions.length !== undefined || Object.keys(suggestions).length === 0) return undefined
        var configs = {}
        for(var section in suggestions) {
          var sectionConfig = suggestions[section]
          configs[section] = {
            limit: 3,
            label: sectionConfig.label,
            onSelected: this.onSelected
          }
        }
        configs.default = {
          limit: 3,
          onSelected: this.onSelected
        }
        return configs
      }
    },
    methods: {
      search: function(suggestions, search) {
        var fuse = new Fuse(suggestions, {shouldSort: true})
        var result = fuse.search(search)
        var filtered = []
        for(var i = 0; i < result.length; i++) {
          filtered.push(suggestions[result[i]])
        }
        return filtered
      },
      onInputChange: function(value) {
        value = value.trim()
        this.$emit('input', value)
        var filtered = []
        var empty = !value.length
        var suggestions = this.suggestions
        if(suggestions.length !== undefined) {
          var allFiltered = empty ? [] : this.search(suggestions, value)
          filtered.push({data: allFiltered})
        } else {
          for(var section in suggestions) {
            var sectionConfig = suggestions[section]
            var sectionSuggestions = sectionConfig.suggestions
            var sectionFiltered = empty ? [] : this.search(sectionSuggestions, value)
            if(sectionFiltered.length) filtered.push({name: section, data: sectionFiltered})
          }
        }
        this.filteredSuggestions = filtered
      },
      onSelected: function(e) {
        this.$emit('input', e.item)
      }
    },
    template: `
      <vue-autosuggest
        :suggestions="filteredSuggestions"
        :sectionConfigs="sectionConfigs"
        :inputProps="inputProps"
      />
    `
  })
})()
