import { Component } from './base/component';
import { ensureElement } from '../utils/utils';

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onCkick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _total: HTMLElement;
	protected _close: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		if (actions?.onCkick) {
			this._close.addEventListener('click', actions.onCkick);
		}
	}

	set total(value: number) {
		this.setText(this._total, `списано ${value} синапсов`);
	}
}
