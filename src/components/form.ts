import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';
import { View } from './base/view';

interface IFormState {
	valid: boolean;
	errors: string[];
}

export class Form<T> extends View<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(events: EventEmitter, protected container: HTMLFormElement) {
		super(events, container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		let data = { valid, errors };
		super.render(data);
		Object.assign(this, inputs);
		return this.container;
	}
}
