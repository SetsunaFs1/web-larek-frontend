import { Form } from './form';
import { OrderForm } from '../types';
import { ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

export class Contacts extends Form<OrderForm> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;
	constructor(events: EventEmitter, container: HTMLFormElement) {
		super(events, container);
		this._emailInput = ensureElement<HTMLInputElement>(
			'.form__input[name=email]',
			this.container
		);
		this._phoneInput = ensureElement<HTMLInputElement>(
			'.form__input[name=phone]',
			this.container
		);

		this._emailInput.addEventListener('input', (event) => {
			const value = (event.target as HTMLInputElement).value;
			this.email = value;
			this.onInputChange('email', value);
		});

		this._phoneInput.addEventListener('input', (event) => {
			const value = (event.target as HTMLInputElement).value;
			this.phone = value;
			this.onInputChange('phone', value);
		});
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}
}
