import { LitElement, html, css } from 'lit';
import { customElement, property} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';
import {animate, fadeOut, fadeIn, flyRight, flyLeft} from '@lit-labs/motion';


import { ToastLevel, ToastType, ToastBaseClass } from './base/mp-toast-base';
// export enum ToastLevel {
//     TOAST_INFO,
//     TOAST_ALERT,
//     TOAST_ERROR
// }
// export type ToastType = {
//     id: number,
//     message: string
//     level?: ToastLevel,
//     sticky?:boolean,
//     uid?: string

// }
@customElement('mp-toast')
export class Toast extends ToastBaseClass {

    static styles = [
        ToastBaseClass.styles,
        css`
        #container {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            align-items: center;
            position: absolute;
            transform: translate(-50%, 0);
            left: 50%;
            
            max-width: 33%;
            min-width: 15%;
           
        }

        .message-container {
            
            position: relative;
            flex: 1;
            
           
           
            display: flex;
            align-items: center;

        }
        .level-indicator {
            /* background-color: rgba(0, 179, 177, 1); */
            align-self: stretch;
            
            max-width: 0.5rem;
            min-width: 0.5rem;

        }
        .close-button {
            
            padding: 0.2rem;
            background: rgba(37, 31, 53, 0.67);
            border: black;
            color: white;
            font-size: 1.2rem;
            border: 1px solid black;
            margin-right: 0.2rem;
            align-self: stretch;
           
        }
        .content {
            padding: 0.25rem;
            cursor: default;
        }

        

        @media screen and (max-width: 800px) { 
            #container {
                min-width: 90%;
                max-width: 90%;
            }
        }

    `];
    
    // @property({type: Array})
    // messages:Array<ToastType> = [];

    // @property({type: Number})
    // timeoutMS: number = 1500;

    // @property({type: Boolean})
    // stackToasts:boolean = true;
    // @property({type: Boolean})
    // stackToasts:boolean = false;

    @property({type: Boolean})
    reverse:boolean = true;

    @property()
    verticalAlign: 'top' | 'bottom' = 'top';

    @property()
    containerGap: string = '5px';

    
    lengthBeforeUpdate = 0;

    
    
    // show(m:ToastType) {
    //     if(!this.animIn) this.animIn = true;

    //     if(!m.level) m.level = ToastLevel.TOAST_INFO;
    //     if(!m.sticky) m.sticky = false;

    //     m.uid = Date.now().toString(36) + Math.random().toString(36).substring(2);
        
    //     if(this.stackToasts)
    //         this.messages = [...this.messages, m];
    //     else {
    //         this.messages = [m];
    //     }
    // }

    // removeToast(e:Event, m: ToastType) {
    //     //disable default double click select text behaviour 
    //     e.preventDefault();

    //     this.animIn = false;
    //     this.messages = this.messages.filter((i) => i !== m);

    //     return false;
    // }

    // addRandomItem() {
    //     let i:number = this.messages.length > 0 ? this.messages[this.messages.length - 1].id + 1 : 0;
    //     this.show({id: i, message: this.test_messages[Math.floor(Math.random() * this.test_messages.length)], level: Math.floor(Math.random() * 3), sticky: true});
    // }

    protected shouldUpdate(_changedProperties: Map<string | number | symbol, unknown>): boolean {
       
        return true;
    }
    multilineRender() {
        console.log('multiLineRender:', this.messages);
        const animMS = 1500 / this.messages.length;
        const keyframeOptions:KeyframeAnimationOptions = {
            duration: animMS,
            // easing: 'ease-out',
            easing: 'cubic-bezier(.56,-0.56,.38,1.53)',
            fill: 'both',
        };
        const d:number = keyframeOptions.duration as number / this.messages.length;
        
        return html `
             ${repeat(
                    this.reverse ? this.messages.slice().reverse() : this.messages, 
                    (item) => item.uid, 
                    (item, index) => {
                        
                    const orderStyle = {order: index.toString()};
                    const animOrderFlag = this.animIn && this.verticalAlign === 'top';
                    let delay_firstInOut = !this.animIn  && this.verticalAlign === 'top';

                    if(this.animIn && this.verticalAlign === 'bottom') {
                        delay_firstInOut = this.animIn;
                    } 
                    console.log('multiLineRender:', delay_firstInOut);
                    return html`<div class="message-container"
                    
                    ${animate({
                        //disabled: item === this.removedItem ? true : false,
                        //properties: ['opacity', 'top'],
                        in: fadeIn,
                        //out: undefined,
                        id: index,
                        stabilizeOut: false,
                        skipInitial: true,
                        keyframeOptions: {...keyframeOptions, delay: delay_firstInOut ?  index * d : animMS - (index * d)},
                        
                    })}
                    >${item.id} : ${item.message}<button @click=${this.removeToast.bind(this, item)}>X</button></div>`})}
        `;
    }

    render() {
        
        
        // const keyframeOptions:KeyframeAnimationOptions = {
        //     duration: 300,
        //     // easing: 'ease-out',
        //     easing: 'cubic-bezier(.56,-0.56,.38,1.53)',
        //     fill: 'both',
        // };

        const verticalStyle = this.verticalAlign === 'top' ? {top: this.containerGap} : {bottom: this.containerGap};
        
        //<button @click=${this.addRandomItem}>Add random</button>
        return html`
            
            <section id="container" role="status" style=${styleMap(verticalStyle)} >
            ${repeat(
                    this.reverse ? this.messages.slice().reverse() : this.messages, 
                    (item) => item.uid, 
                    (item, index) => {
                        const classes = {
                            'level-1-color': item.level === ToastLevel.TOAST_INFO,
                            'level-2-color': item.level === ToastLevel.TOAST_ALERT,
                            'level-3-color': item.level === ToastLevel.TOAST_ERROR
                          };
                        return html`<output class="message-container" @mousedown=${(e:Event) => e.preventDefault()} @dblclick=${(e:Event) => this.removeToast(e, item)}
                        ${animate(
                            {
                                keyframeOptions: this.keyframeOptions,
                                properties: ['opacity', 'top', 'left'],
                                skipInitial: false,
                                stabilizeOut: true,
                                in: this.animIn && this.messages.length === 1 ? this.animations.singleIn : this.animations.in,
                                out: this.messages.length === 1 ? this.animations.singleOut : this.animations.out,

                                onComplete: () => {
                                    if(!item.sticky) {
                                        setTimeout(() => {
                                            this.messages = this.messages.filter((i) => i !== item);
                                        }, this.timeoutMS);
                                    }
                                }
                            }
                        )}
                        >
                        <div class="level-indicator ${classMap(classes)}"></div><div class="content">${item.message}</div>
                        ${item.sticky ? html`<button aria-label="Close to popup message" class="close-button" @click=${(e:Event) => this.removeToast(e, item)}>X</button>` : undefined}
                        </output>`})
                    }
            </section>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
      "mp-toast": Toast,
    }
}

//https://github.com/adobe/spectrum-web-components/blob/main/packages/toast/src/Toast.ts
//https://www.youtube.com/watch?v=R75ZVW4LW5o

