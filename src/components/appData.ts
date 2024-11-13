import { IBasket, IProduct, IOrder, OrderForm, PaymentMethod } from '../types';
import { IEvents } from './base/events';

export class AppData {
	items: IProduct[] = [];
	preview: IProduct = null;
	basket: IBasket = {
		items: [],
		total: 0,
	};
	order: IOrder = {
		payment: 'card',
		email: '',
		phone: '',
		address: '',
		items: [],
		total: 0,
	};
	formErrors: Partial<Record<keyof OrderForm, string>> = {};

	constructor(protected events: IEvents) {}

	setItems(items: IProduct[]) {
		this.items = items;
		this.events.emit('items:changed', this.items);
	}

	setPreview(item: IProduct) {
		this.preview = item;
		this.events.emit('preview:change', this.preview);
	}

	inBasket(item: IProduct) {
		if (this.basket.items.includes(item.id) == true) {
			return true;
		} else {
			return false;
		}
	}

	addToBasket(item: IProduct) {
		this.basket.items.push(item.id);
		this.basket.total = this.basket.total + item.price;
		this.events.emit('basket:change', this.basket);
	}

	removeFromBasket(item: IProduct) {
		this.basket.items = this.basket.items.filter((id) => id != item.id);
		this.basket.total = this.basket.total - item.price;
		this.events.emit('basket:change', this.basket);
	}

	clearBasket() {
		this.basket.items = [];
		this.basket.total = 0;
		this.events.emit('basket:change', this.basket);
	}

	setPaymentMethod(method: PaymentMethod) {
		this.order.payment = method;
	}

	setOrderField(field: keyof OrderForm, value: string) {
		if (field == 'payment') {
			this.setPaymentMethod(value as PaymentMethod);
		} else {
			this.order[field] = value;
		}

		if (this.order.payment && this.validateOrder()) {
			this.order.total = this.basket.total;
			this.order.items = this.basket.items;
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = 'Не выбран способ оплаты';
		}
		if (!this.order.email) {
			errors.email = 'Не указан email';
		}
		if (!this.order.phone) {
			errors.phone = 'Не указан телефон';
		}
		if (!this.order.address) {
			errors.address = 'Не указан адрес';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
