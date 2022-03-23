import {LitElement, css, CSSResultGroup} from 'lit';
import {property} from 'lit/decorators.js';
import {fadeOut, fadeIn, flyRight, flyLeft, AnimateController} from '@lit-labs/motion';

export enum ToastLevel {
    TOAST_INFO,
    TOAST_ALERT,
    TOAST_ERROR
}
export type ToastType = {
    id: number,
    message: string
    level?: ToastLevel,
    sticky?:boolean,
    uid?: string

}

export class ToastBaseClass extends LitElement {
    
    static styles = css`
        :host {
            pointer-events: none;
        }
        #container {
            pointer-events: none;
        }
        .message-container {
            pointer-events: auto;
            border: var(--mp-toast-border, 1px solid black);
            background-color: var(--mp-toast-bg-color, rgba(12, 0, 0, 0.75));
            color: var(--mp-toast-color, white);
            font-size: var(--mp-toast-font-size, 1.2rem);
        }
        .level-1-color {
            background-color: var(--mp-toast-level1-color, rgba(0, 179, 177, 1));
        }
        .level-2-color {
            background-color: var(--mp-toast-level1-color,rgba(234, 207, 64, 1));
        }
        .level-3-color {
            background-color: var(--mp-toast-level3-color, rgba(205, 30, 30, 1));
        }
    ` as CSSResultGroup;
    @property({type: Array})
    messages:Array<ToastType> = [];

    @property({type: Number})
    timeoutMS: number = 1500;

    @property({attribute: 'stack-toasts', type: Boolean})
    stackToasts:boolean;

    @property({attribute: false})
    keyframeOptions:KeyframeAnimationOptions = {
        duration: 300,
        // easing: 'ease-out',
        easing: 'cubic-bezier(.56,-0.56,.38,1.53)',
        fill: 'both',
    };

    @property({attribute: false})
    animations = {
        singleIn: flyLeft,
        singleOut: flyRight,
        in: fadeIn,
        out: undefined
    };

    animIn = true;
    controller;
    constructor() {
        super();
        this.controller = new AnimateController(this,  {});
    }
    show(m:ToastType) {
        
        if(!this.animIn) this.animIn = true;

        if(!m.level) m.level = ToastLevel.TOAST_INFO;
        if(!m.sticky) m.sticky = false;

        m.uid = Date.now().toString(36) + Math.random().toString(36).substring(2);
        //console.log('show:', this.stackToasts);
        if(this.stackToasts)
            this.messages = [...this.messages, m];
        else {
            this.messages = [m];
        }
    }

    removeToast(e:Event, m: ToastType) {
        //disable default double click select text behaviour 
        e.preventDefault();

        this.animIn = false;
        this.messages = this.messages.filter((i) => i !== m);

        return false;
    }

}