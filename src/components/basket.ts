import { cloneTemplate, createElement, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';
import { View } from './base/view';

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class Basket extends View<IBasketView> {
	static template = ensureElement<HTMLTemplateElement>('#basket');

	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(events: EventEmitter) {
		super(events, cloneTemplate(Basket.template));

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLElement>(
			'.basket__button',
			this.container
		);

		this._button.addEventListener('click', () => {
			events.emit('order:open');
		});

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length != 0) {
			this._list.replaceChildren(...items);
			this._button.removeAttribute('disabled');
		} else {
			this._list.replaceChildren(
				createElement<HTMLDivElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this._button.setAttribute('disabled', '');
		}
	}

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}
}
