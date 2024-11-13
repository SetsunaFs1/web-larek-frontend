import { Component } from './component';
import { IEvents } from './events';

export class View<T> extends Component<T> {
	constructor(protected readonly events: IEvents, container: HTMLElement) {
		super(container);
	}
}
