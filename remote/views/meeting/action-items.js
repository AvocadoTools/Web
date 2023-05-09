import AvocadoHBox from "../../../containers/hbox.js";
import AvocadoVBox from "../../../containers/vbox.js";

import AvocadoButton from "../../../controls/button.js";
import AvocadoColumn from "../../../controls/column.js";
import AvocadoDatePicker from "../../../controls/date-picker.js";
import AvocadoInput from "../../../controls/input.js";
import AvocadoLabel from "../../../controls/label.js";
import AvocadoSelect from "../../../controls/select.js";
import AvocadoTable from "../../../controls/table.js";

import { store } from "../../store.js";

export default class RemoteMeetingActions extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-basis: 0;
          flex-direction: column;
          flex-grow: 1;
          padding: 16px 16px 26px 16px;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        adc-button {
          margin: 0 0 20px 0;
        }

        adc-hbox {
          align-items: flex-end;
          gap: 16px;
        }

        adc-input {
          flex-basis: 0;
          flex-grow: 1;
        }

        adc-table {
          flex-basis: 0;
          flex-grow: 1;
        }        

        adc-vbox[slot=empty] {
          align-items: center;
          flex-basis: 0;
          flex-grow: 1;
          justify-content: center;
        }

        adc-vbox[slot=empty] adc-label {
          --label-color: #525252;
        }        
      </style>
      <adc-hbox>
        <adc-input
          label="Description"
          light
          placeholder="Description">
        </adc-input>            
      </adc-hbox>
      <!--
      <adc-hbox>
        <adc-input
          label="Priority"
          light
          placeholder="Priority"
          style="max-width: 165px;"          
          value="High">
        </adc-input>               
        <adc-input
          label="Status"
          light
          placeholder="Status"
          style="max-width: 250px;"          
          value="Complete">
        </adc-input>     
        <adc-input
          label="Next steps"
          light
          placeholder="Next steps"
          value="Do this next">
        </adc-input>                                         
      </adc-hbox>
      -->
      <adc-hbox>
        <adc-select
          label="Priority"
          label-field="name"
          light
          name="priority"
          placeholder="Priority"
          style="min-width: 200px;">
        </adc-select>                           
        <adc-select
          label="Owner"
          label-field="fullName"
          light
          name="owner"
          placeholder="Owner"
          style="flex-basis: 0; flex-grow: 1;">
        </adc-select>                                   
        <adc-date-picker
          label="Due date"
          light
          placeholder="Due date"
          style="min-width: 165px;">
        </adc-date-picker>
        <adc-button 
          kind="secondary" 
          size="md">
          Add item
        </adc-button>
      </adc-hbox>
      <adc-table light>
        <adc-column sortable>Description</adc-column>
        <adc-column sortable width="266">Owner</adc-column>        
        <adc-column sortable width="165">Due date</adc-column>     
        <adc-vbox slot="empty">
          <adc-label>No action items added yet.</adc-label>
        </adc-vbox>                                        
      </adc-table>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Element
    this.$add = this.shadowRoot.querySelector( 'adc-button' );    
    this.$description = this.shadowRoot.querySelector( 'adc-input' );
    this.$due = this.shadowRoot.querySelector( 'adc-date-picker' );      
    this.$owner = this.shadowRoot.querySelector( 'adc-select[name=owner]' );
    this.$priority = this.shadowRoot.querySelector( 'adc-select[name=priority]' );  
    this.$table = this.shadowRoot.querySelector( 'adc-table' );

    // State
    store.person.subscribe( ( data ) => this.$owner.provider = data );    
    store.priority.subscribe( ( data ) => this.$priority.provider = data );        
  }

   // When attributes change
  _render() {
    this.$description.readOnly = this.readOnly;
    this.$priority.readOnly = this.readOnly;
    this.$owner.readOnly = this.readOnly;
    this.$due.readOnly = this.readOnly;
    this.$add.disabled = this.readOnly;
    // this.$attendee.readOnly = this.readOnly;
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
    this._upgrade( 'disabled' );
    this._upgrade( 'helper' );
    this._upgrade( 'hidden' );
    this._upgrade( 'icon' );
    this._upgrade( 'label' );
    this._upgrade( 'readOnly' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'helper',
      'hidden',
      'icon',
      'label',
      'read-only'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Properties
  // Not reflected
  // Array, Date, Object, null
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
  }

  // Attributes
  // Reflected
  // Boolean, Number, String, null
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

  get disabled() {
    return this.hasAttribute( 'disabled' );
  }

  set disabled( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'disabled' );
      } else {
        this.setAttribute( 'disabled', '' );
      }
    } else {
      this.removeAttribute( 'disabled' );
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

  get icon() {
    if( this.hasAttribute( 'icon' ) ) {
      return this.getAttribute( 'icon' );
    }

    return null;
  }

  set icon( value ) {
    if( value !== null ) {
      this.setAttribute( 'icon', value );
    } else {
      this.removeAttribute( 'icon' );
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
}

window.customElements.define( 'arm-meeting-actions', RemoteMeetingActions );