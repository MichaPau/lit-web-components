import { LitElement, html, css } from 'lit';
import { customElement, property} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import {classMap} from 'lit/directives/class-map.js';

import {animate, fadeOut, fadeIn, flyRight, flyLeft, defaultCssProperties, position} from '@lit-labs/motion';
import { ToastLevel, ToastType, ToastBaseClass } from './base/mp-toast-base';

export const pushIn = [{transform: 'translateX(-100%)'}, {transform: 'translateX(0%)'}];
export const pushOut = [{transform: 'translateX(0%)'}, {transform: 'translateX(150%)'}];

@customElement('mp-toast-inline')
export class ToastInline extends ToastBaseClass {

    // @property(
    //     {type: Boolean,
    //     hasChanged(newVal: boolean, oldVal: boolean) {
    //         if(newVal === true) {
    //             throw new Error('Setting \'stackToast\' property to true is not allowed in class ToastInline. It is always false.');
    //         }
    //         return false;
    //     }
    // })
    stackToasts: false = false;

    static styles = [
        ToastBaseClass.styles, 
        css`
        :host {
            display: inline-block;
            position: absolute;
            left: 0px;
            width: 100%;
            /* background-color: rgba(0, 0, 0, 0.3); */
            height: 100%;
            overflow: hidden;
        }
        #container {
            /* display: flex;
            flex-direction: row; */
            position: relative;
            
            max-width: 100%;
            width: 100%;
            height: 100%;
            /* background-color: rgba(255, 0, 0, 0.5); */

        }
        .message-container {
            box-sizing: border-box;
            position: absolute;
            /* flex: 1 0 auto; */
            max-width: 75%;
            /* padding: 0.2rem; */
            /* background-color: rgba(12, 0, 0, 0.75);
            font-size: 1rem;
            color: white; */
            font-size: var(--mp-toast-font-size, 1rem);
            font-size: 1rem;
            height: 100%;
            display: flex;
            align-items: center;
            
        }
        .level-indicator {
            /* background-color: rgba(0, 179, 177, 1); */
            align-self: stretch;
            
            max-width: 0.25rem;
            min-width: 0.25rem;

        }
        .content {
            padding: 0.25rem;
            cursor: default;
            flex: 1 1 auto;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    `];

    render() {

        // if(!this.messages[0]) {
        //     console.log('render undefined');
        //     return undefined;
        // }
        // const item = this.messages[0];
        // console.log(item.message);
        
        return html`
            
            <section id="container" role="status">
            ${repeat(
                    this.messages,

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
                                id: item.uid,
                                // in: this.animIn && this.messages.length === 1 ? this.animations.singleIn : this.animations.in,
                                // out: this.messages.length === 1 ? this.animations.singleOut : this.animations.out,
                                in: pushIn,
                                out: pushOut,

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
        // return html`
        //     <section role="status">
        //         <output
        //         ${animate(
        //         {
        //             keyframeOptions: this.keyframeOptions,
        //             skipInitial: false,
        //             stabilizeOut: true,
        //             id: item.uid,
        //             in: pushIn,
        //             out: pushOut,

        //             onComplete: () => {
        //                 console.log('onComplete for item:' + item.message);
        //                 if(!item.sticky && this.animIn) {
        //                     console.log('set timeout');
        //                     setTimeout(() => {
        //                         console.log('on complete for:', item.message);
        //                         this.messages = this.messages.filter((i) => i !== item);
        //                         this.animIn = false;
        //                     }, this.timeoutMS);
        //                 }
        //             }
        //         }
        //     )}
        //         >${this.messages[0].message}</output>
        //         ${item.sticky ? html`<button aria-label="Close to popup message" class="close-button" @click=${(e:Event) => this.removeToast(e, item)}>X</button>` : undefined}
        //     </section>
        // `;
    }

}

declare global {
    interface HTMLElementTagNameMap {
      "mp-toast-inline": ToastInline,
    }
}