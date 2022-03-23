import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import { queryAll } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined';

// Registers the element
@customElement('mp-object-param-edit')
export class ObjectParamEdit extends LitElement {
  // Styles are applied to the shadow root and scoped to this element
  static styles = css`
    :host {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      display: flex;
      flex-direction: column;
      justify-content: center;
      max-width: 100%;
      max-height: 100%;
      border: 1px solid black;
      background-color: whitesmoke;
      width: 50%;
    }
    #header {
      display: flex;
      align-items: center;
      border-bottom: 1px solid black;
      height: 2rem;
      padding: 0 1rem;
    }
    #content {
        display: flex;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        flex-direction: column;
        justify-items: left;
        padding: 1rem;
        overflow: auto;
        gap: 0.5rem;
    }
    #footer {
      box-sizing: border-box;
      border-top: 1px solid black;
      height: 2.5rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 1rem;
      gap: 0.5rem;
    }
    
    .header-text {
      font-size: 1.5rem;
      
    }
    .input-container {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      align-items: center;
        
    }
    label {
      flex: 0 0 5rem;
      /* margin-left: auto; */
      text-align: right;
    }
    input {
      flex: 1 0 auto;
      /* margin-right: auto; */
      
    }
    input[type='checkbox'] {
      flex: 0 1 auto;
      margin-right: auto;

    }
  `;

  // Creates a reactive property that triggers rendering
  @property({attribute:'header-text'})
  headerText = 'Object properties:';

  maxLabelChars:number = 8;

  @property({type: Array})
  guardKeys = [];

  @property({})
  obj;

  @queryAll('input') 
  inputs:NodeList;

  

  connectedCallback(): void {
      super.connectedCallback();
      console.log('obj:', this.obj);
      
  }

  firstUpdated(): void {
      
  }
  onUpdate(e:Event) {
    let retObj = {...this.obj};

    this.inputs.forEach((item) => {
      const input = item as HTMLInputElement;
      if(input.type === 'number') {
        retObj[input.name] = parseInt(input.value);
      } else if (input.type === 'boolean') {
        retObj[input.name] = input.checked;
      } else {
        retObj[input.name] = input.value;
      }
      
    });

    this.dispatchEvent(new CustomEvent('mp-object-param-edit-update', {bubbles:true, composed: true, detail: {obj: retObj}}));

  }
  onCancel(e:Event) {
    this.dispatchEvent(new CustomEvent('mp-object-param-edit-close', {bubbles: true, composed: true}));
  }
  // Render the component's DOM by returning a Lit template
  renderParams() {
    console.log(this.guardKeys);
    const renderItems = [];
    let k: keyof typeof this.obj;
    
    for(k in this.obj) {
        console.log(k, this.guardKeys.includes(k));
        let inputType: any = 'text';
        let labelText:string = k;
        if(labelText.length > this.maxLabelChars) {
          labelText = labelText.slice(0, this.maxLabelChars) + '..';
        }
        // let validType = true;
        switch(typeof this.obj[k]) {
            case 'string':
                inputType = 'text';
                
                renderItems.push(html`
                  <div class='input-container'><label for='${k}'>${labelText}: </label>
                  <input name='${k}' type=${inputType} value='${this.obj[k]}' ?disabled=${this.guardKeys.includes(k)}></div>
                `);
                break;
            case 'number':
                inputType = 'number';
                renderItems.push(html`
                  <div class='input-container'><label for='${k}'>${labelText}: </label>
                  <input name='${k}' type=${inputType} value='${this.obj[k]}' ?disabled=${this.guardKeys.includes(k)}></div>
                `);
                break;
            case 'boolean':
                inputType = 'checkbox';
                renderItems.push(html`
                  <div class='input-container'><label for='${k}'>${labelText}: </label>
                  <input name='${k}' type=${inputType} value='${this.obj[k]}' ?disabled=${this.guardKeys.includes(k)} ?checked=${this.obj[k] === true}></div>
                `);
                break;
            default:
              console.log('ObjectParamEdit::renderParams - Type ', k, ' not supported. (only string, number and boolean)');
              //validType = false;

        }
        // if(validType) {
        //   renderItems.push(html`
        //     <div class='input-container'><label for='${k}'>${labelText}: </label>
        //     <input name='${k}' type=${inputType} value='${this.obj[k]}' ?disabled=${this.guardKeys.includes(k)}></div>
        //   `);
        // }
        //renderItems.push(html`<span>${k} : ${this.obj[k]}</span>`);
    }

    return renderItems;
  }
  render() {
    return html`
        <div id='header'><span>${this.headerText}</span></span></div>
        <div id='content'>
            ${this.renderParams()}
        </div>
        <div id='footer'>
          <button @click=${this.onCancel}>Cancel</button>
          <button @click=${this.onUpdate}>Update</button>
        </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mp-object-param-edit": ObjectParamEdit,
  }
}