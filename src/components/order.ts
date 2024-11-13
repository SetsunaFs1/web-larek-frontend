import { Form } from './form';
import { OrderForm, PaymentMethod } from '../types';
import { EventEmitter } from './base/events';
import { ensureElement } from '../utils/utils';

export class Order extends Form<OrderForm> {
	protected _paymentCard: HTMLButtonElement;
	protected _paymentCash: HTMLButtonElement;
	protected _inputAddress: HTMLInputElement;

	constructor(events: EventEmitter, container: HTMLFormElement) {
		super(events, container);

		this._paymentCard = ensureElement<HTMLButtonElement>(
			'.button_alt[name=card]',
			this.container
		);
		this._paymentCash = ensureElement<HTMLButtonElement>(
			'.button_alt[name=cash]',
			this.container
		);
		this._inputAddress = ensureElement<HTMLInputElement>(
			'.form__input',
			this.container
		);

		this._paymentCard.addEventListener('click', () => {
			this.payment = 'card';
			this.onInputChange('payment', 'card');
		});

		this._paymentCash.addEventListener('click', () => {
			this.payment = 'cash';
			this.onInputChange('payment', 'cash');
		});

		this._inputAddress.addEventListener('input', (event) => {
			const value = (event.target as HTMLInputElement).value;
			this.address = value;
			this.onInputChange('address', value);
		});
	}

	set payment(value: PaymentMethod) {
		this._paymentCard.classList.toggle('button_alt-active', value == 'card');
		this._paymentCash.classList.toggle('button_alt-active', value == 'cash');
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
