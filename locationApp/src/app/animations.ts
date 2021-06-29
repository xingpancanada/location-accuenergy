import { animate, state, style, transition, trigger } from "@angular/animations";
import { getCurrencySymbol } from "@angular/common";


export const markedStateTrigger = trigger('markedState', [
    transition(':enter', [
        style({
            transform: 'scale(1.1)',
            opacity: 0,
            color: 'blue',
        }),
        animate('500ms ease-out', style({
            transform: 'scale(1)',
            opacity: 1,
            color: 'black',
        }))
    ]),
    
]);

export const showStateTrigger = trigger('showState', [
    transition(':enter', [
        style({
          transform: 'translateY(200%)',
          opacity: 0,
        }),
        animate('500ms ease-out', style({
          transform: 'translateY(0)',
          opacity: 1
        }))
      ]),
      transition(':leave', [
        style({
          transform: 'translateY(0)',
          opacity: 1
        }),
        animate('500ms ease-out', style({
          transform: 'translateY(200%)',
          opacity: 0
        }))
      ])
])