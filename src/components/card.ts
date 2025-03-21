import { Component } from './base/component';
import { IProduct } from '../types';
import { bem, ensureElement } from '../utils/utils';

interface ICardActions {
	onClick(event: MouseEvent): void;
}

type CardModifier = 'compact' | 'full';

export class Card extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _price: HTMLElement;
	protected _description?: HTMLElement;
	protected _category?: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);

		this._category = container.querySelector('.card__category');
		this._button = container.querySelector('.card__button');
		this._image = container.querySelector('.card__image');
		this._description = container.querySelector('.card__description');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	toggle(modifier: CardModifier) {
		this.toggleClass(bem('card', undefined, modifier).name);
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		if (this.container.dataset.id){
			return this.container.dataset.id;
		} else {
			return '';
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		if (this._title.textContent) {
			return this._title.textContent;
		} else {
			return '';
		}
	}

	set price(value: number) {
		if (value != 0) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
		}

		if (this._button) {
			this._button.disabled = !value;
		}
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set button(value: string) {
		this.setText(this._button, value);
	}
}
