class WC extends HTMLElement {
  constructor() {
    super()

    this.created()
  }
  
  watch() {
    return {}
  }
  props() {
    return ''
  }
  render() {
    return ''
  }
  created() {}
  mounted() {}
  updated() {}

  get observedAttributes() {
    console.log(this)

    return this.props()
  }

  connectedCallback() {
    this._render()
    this.mounted()
  }
  attributeChangedCallback(name, prev, cur) {
    this.watch()[name](prev, cur)
    this._render()
    this.updated()
  }

  _render() {
    this.innerHTML = this.render(
      Object.fromEntries(
        Array
          .from(this.attributes)
          .map(
            (value) => [value.name, this.attributes.getNamedItem(value.name).value]
          )
      )
    )
  }
}

const define = (name, element) => window.customElements.define(name, element);
