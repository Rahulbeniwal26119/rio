import { applyIcon } from '../designApplication';
import { LayoutContext } from '../layouting';
import { ComponentBase, ComponentState } from './componentBase';

export type CheckboxState = ComponentState & {
    _type_: 'Checkbox-builtin';
    is_on?: boolean;
    is_sensitive?: boolean;
};

export class CheckboxComponent extends ComponentBase {
    state: Required<CheckboxState>;

    private checkboxElement: HTMLInputElement;
    private borderElement: HTMLElement;
    private checkElement: HTMLElement;

    createElement(): HTMLElement {
        let element = document.createElement('div');
        element.classList.add('rio-checkbox');

        // Use an actual checkbox input for semantics. This helps e.g. screen
        // readers to understand the element.
        this.checkboxElement = document.createElement('input');
        this.checkboxElement.type = 'checkbox';
        element.appendChild(this.checkboxElement);

        // This will display a border around the checkbox at all times
        this.borderElement = document.createElement('div');
        this.borderElement.classList.add('rio-checkbox-border');
        element.appendChild(this.borderElement);

        // This will display a check mark when the checkbox is on
        this.checkElement = document.createElement('div');
        this.checkElement.classList.add('rio-checkbox-check');
        element.appendChild(this.checkElement);

        // Initialize the icons
        applyIcon(
            this.borderElement,
            'check-box-outline-blank',
            'var(--border-color)'
        );
        applyIcon(this.checkElement, 'check-box:fill', 'var(--check-color)');

        // Listen for changes to the checkbox state
        this.checkboxElement.addEventListener('change', () => {
            this.setStateAndNotifyBackend({
                is_on: this.checkboxElement.checked,
            });
        });

        return element;
    }

    updateElement(
        deltaState: CheckboxState,
        latentComponents: Set<ComponentBase>
    ): void {
        if (deltaState.is_on !== undefined) {
            if (deltaState.is_on) {
                this.element.classList.add('is-on');
            } else {
                this.element.classList.remove('is-on');
            }

            // Assign the new value to the checkbox element, but only if it
            // differs from the current value, to avoid immediately triggering
            // the event again.
            if (this.checkboxElement.checked !== deltaState.is_on) {
                this.checkboxElement.checked = deltaState.is_on;
            }
        }

        if (deltaState.is_sensitive === true) {
            this.element.classList.add('is-sensitive');
            this.checkboxElement.disabled = false;
        } else if (deltaState.is_sensitive === false) {
            this.element.classList.remove('is-sensitive');
            this.checkboxElement.disabled = true;
        }
    }

    updateNaturalWidth(ctx: LayoutContext): void {
        this.naturalWidth = 1.5;
    }

    updateNaturalHeight(ctx: LayoutContext): void {
        this.naturalHeight = 1.5;
    }
}
