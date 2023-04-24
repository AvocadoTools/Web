import AvocadoHBox from "../containers/hbox.js";
import AvocadoVBox from "../containers/vbox.js";

import AvocadoIcon from "./icon.js";
import AvocadoIconButton from "./icon-button.js";
import AvocadoLabel from "./label.js";

export default class AvocadoInput extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        label {
          align-items: center;
          background-color: #f4f4f4;
          border-bottom: solid 1px #8d8d8d;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          margin: 0;
          outline: solid 2px transparent;
          outline-offset: -2px;
          padding: 0;
          transition: background-color 150ms ease-in-out;
        }

        input {
          appearance: none;
          background: none;
          border: none;
          box-sizing: border-box;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          height: 40px;
          margin: 0;
          min-height: 40px;
          outline: none;
          padding: 0 16px 0 16px;
          text-rendering: optimizeLegibility;
          width: 0;
        }

        input::placeholder {
          color: #a8a8a8;
        }        

        label:focus-within {
          outline: solid 2px #0f62fe;
        }
        
        adc-icon {
          padding: 11px;
        }

        :host( [invalid] ) adc-label[part=error] {
          --label-color: #da1e28;
        }

        :host( :not( [helper] ) ) adc-label[part=helper] {
          display: none;
        }

        :host( :not( [helper] ) ) adc-label[part=label] {
          padding: 0 0 4px 0;
        }        

        :host( :not( [invalid] ) ) adc-icon:nth-of-type( 1 ) {
          display: none;
        }

        :host( :not( [label] ) ) adc-label[part=label] {
          display: none;
        }        

        :host( [light] ) label {
          background-color: #ffffff;
        }

        :host( [read-only] ) input {
          cursor: default;
        }

        :host( [read-only] ) label {
          border-bottom: solid 1px transparent;
          cursor: default;
        }

        :host( [read-only] ) label:focus-within {
          outline: none;
        }        

        :host( [invalid] ) label:not( :focus-within ) {
          outline: solid 2px #da1e28;
        }

        adc-icon-button {
          --icon-button-size: 40px;
        }

        adc-icon:nth-of-type( 1 ) {
          --icon-color: #da1e28;
        }        

        adc-label[part=helper] {
          padding: 0 0 4px 0;
          --label-color: #6f6f6f;
        }
        
        adc-vbox {
          flex-basis: 0;
          flex-grow: 1;
        }

        adc-label {
          --label-color: #525252;
          --label-font-size: 12px;
        }

        adc-label[part=error] {
          height: 16px;
          margin: 4px 0 0 0;
          min-height: 16px;
        }

        :host( :not( [error] ) ) adc-label[part=error] {
          visibility: hidden;
        }

        :host( :not( [type=password] ) ) adc-icon-button[part=password] {
          display: none;
        }

        :host( [value]:not( :focus-within ) ) adc-icon-button[part=clear],
        :host( :not( [value] ) ) adc-icon-button[part=clear] {
          display: none;
        }

        ::slotted( adc-label ) {
          --label-color: #6f6f6f;
          --label-font-size: 12px;
        }
      </style>
      <adc-hbox>
        <adc-vbox>
          <adc-label part="label"></adc-label>
          <adc-label part="helper"></adc-label>                
        </adc-vbox>
        <slot></slot>        
      </adc-hbox>
      <label part="field">
        <slot name="prefix"></slot>
        <input part="input" />
        <adc-icon filled name="error"></adc-icon>
        <adc-icon-button name="visibility" part="password"></adc-icon-button>
        <adc-icon-button name="close" part="clear"></adc-icon-button>
      </label>
      <adc-label part="error"></adc-label>
    `;

    // Properties
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$clear = this.shadowRoot.querySelector( 'adc-icon-button[part=clear]' );
    this.$clear.addEventListener( 'click', () => {
      this.clear();
      this.focus();

      this.dispatchEvent( new CustomEvent( 'clear' ) );
    } );    
    this.$error = this.shadowRoot.querySelector( 'adc-label[part=error]' );    
    this.$helper = this.shadowRoot.querySelector( 'adc-label[part=helper]' );        
    this.$input = this.shadowRoot.querySelector( 'input' );
    this.$input.addEventListener( 'input', ( evt ) => {
      this.value = evt.currentTarget.value;
    } );    
    this.$label = this.shadowRoot.querySelector( 'adc-label[part=label]' );    
  }

  blur() {
    this.$input.blur();
  }

  clear() {
    this.$input.value = '';
    this.value = null;
  }

  focus() {
    this.$input.focus();
  }

  // When things change
  _render() {
    this.$label.text = this.label;
    this.$helper.text = this.helper;    
    this.$input.placeholder = this.placeholder === null ? '' : this.placeholder;
    this.$input.readOnly = this.readOnly;
    this.$input.type = this.type === null ? 'text' : this.type;
    this.$input.value = this.value === null ? '' : this.value;
    this.$error.text = this.error;
  }

  // Promote properties
  // Values may be set before module load
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  // Setup
  connectedCallback() {
    this._upgrade( 'concealed' );
    this._upgrade( 'data' );
    this._upgrade( 'error' );    
    this._upgrade( 'helper' );
    this._upgrade( 'hidden' );
    this._upgrade( 'invalid' );    
    this._upgrade( 'label' );        
    this._upgrade( 'light' );        
    this._upgrade( 'placeholder' );
    this._upgrade( 'readOnly' );
    this._upgrade( 'type' );    
    this._upgrade( 'value' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'error',
      'helper',
      'hidden',
      'invalid',
      'label',
      'light',
      'placeholder',
      'read-only',
      'type',
      'value'
    ];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Arbitrary storage
  // For your convenience
  // Not used in component
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
  }

  // Reflect attributes
  // Return typed value (Number, Boolean, String, null)
  get concealed() {
    return this.hasAttribute( 'concealed' );
  }

  set concealed( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'concealed' );
      } else {
        this.setAttribute( 'concealed', '' );
      }
    } else {
      this.removeAttribute( 'concealed' );
    }
  }

  get error() {
    if( this.hasAttribute( 'error' ) ) {
      return this.getAttribute( 'error' );
    }

    return null;
  }

  set error( value ) {
    if( value !== null ) {
      this.setAttribute( 'error', value );
    } else {
      this.removeAttribute( 'error' );
    }
  }  

  get helper() {
    if( this.hasAttribute( 'helper' ) ) {
      return this.getAttribute( 'helper' );
    }

    return null;
  }

  set helper( value ) {
    if( value !== null ) {
      this.setAttribute( 'helper', value );
    } else {
      this.removeAttribute( 'helper' );
    }
  }  

  get hidden() {
    return this.hasAttribute( 'hidden' );
  }

  set hidden( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hidden' );
      } else {
        this.setAttribute( 'hidden', '' );
      }
    } else {
      this.removeAttribute( 'hidden' );
    }
  }

  get invalid() {
    return this.hasAttribute( 'invalid' );
  }

  set invalid( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'invalid' );
      } else {
        this.setAttribute( 'invalid', '' );
      }
    } else {
      this.removeAttribute( 'invalid' );
    }
  }  

  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  set label( value ) {
    if( value !== null ) {
      this.setAttribute( 'label', value );
    } else {
      this.removeAttribute( 'label' );
    }
  }

  get light() {
    return this.hasAttribute( 'light' );
  }

  set light( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'light' );
      } else {
        this.setAttribute( 'light', '' );
      }
    } else {
      this.removeAttribute( 'light' );
    }
  }  

  get placeholder() {
    if( this.hasAttribute( 'placeholder' ) ) {
      return this.getAttribute( 'placeholder' );
    }

    return null;
  }

  set placeholder( value ) {
    if( value !== null ) {
      this.setAttribute( 'placeholder', value );
    } else {
      this.removeAttribute( 'placeholder' );
    }
  }

  get readOnly() {
    return this.hasAttribute( 'read-only' );
  }

  set readOnly( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'read-only' );
      } else {
        this.setAttribute( 'read-only', '' );
      }
    } else {
      this.removeAttribute( 'read-only' );
    }
  }

  get type() {
    if( this.hasAttribute( 'type' ) ) {
      return this.getAttribute( 'type' );
    }

    return null;
  }

  set type( value ) {
    if( value !== null ) {
      this.setAttribute( 'type', value );
    } else {
      this.removeAttribute( 'type' );
    }
  }  

  get value() {
    let result = null;

    if( this.hasAttribute( 'value' ) ) {
      if( this.getAttribute( 'value').length > 0 ) {
        result = this.getAttribute( 'value' );
      }
    }

    return result;
  }

  set value( content ) {
    if( content !== null ) {
      if( content.trim().length === 0 ) {
        this.removeAttribute( 'value' );
      } else {
        this.setAttribute( 'value', content );
      }
    } else {
      this.removeAttribute( 'value' );
    }
  }
}

window.customElements.define( 'adc-input', AvocadoInput );
