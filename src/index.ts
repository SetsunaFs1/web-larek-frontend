import './scss/styles.scss';

import { WebLarekApi } from './components/webLarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, OrderForm } from './types';
import { Card } from './components/card';
import { Modal } from './components/modal';

import { EventEmitter } from './components/base/events';
import { AppData } from './components/appData';
import { Page } from './components/page';
import { Basket } from './components/basket';
import { Success } from './components/success';
import { Order } from './components/order';
import { Contacts } from './components/contacts';

const api = new WebLarekApi(CDN_URL, API_URL);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const events = new EventEmitter();
const appData = new AppData(events);

const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));
const page = new Page(document.body, events);
const basket = new Basket(events);
const orderForm = new Order(
	events,
	cloneTemplate(ensureElement<HTMLTemplateElement>('#order'))
);
const contactsForm = new Contacts(
	events,
	cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts'))
);

events.on('contacts:submit', () => {
	api
		.orderProducts(appData.order)
		.then((result) => {
			const success = new Success(
				cloneTemplate(ensureElement<HTMLTemplateElement>('#success')),
				{
					onCkick: () => {
						modal.close();
						appData.clearBasket();
					},
				}
			);

			modal.render({
				content: success.render(result),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('order:open', () => {
	modal.render({
		content: orderForm.render({
			payment: 'card',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:ready', () => {
	contactsForm.valid = true;
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof OrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof OrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on('formErrors:change', (errors: Partial<OrderForm>) => {
	const { payment, address, email, phone } = errors;
	orderForm.valid = !(payment || address);
	orderForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contactsForm.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('card:select', (item: IProduct) => {
	appData.setPreview(item);
});

events.on('items:changed', (items: IProduct[]) => {
	page.catalog = items.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render(item);
	});
});

events.on('basket:change', () => {
	page.counter = appData.basket.items.length;

	basket.items = appData.basket.items.map((id) => {
		const item = appData.items.find((item) => item.id == id);
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => appData.removeFromBasket(item),
		});
		return card.render(item);
	});
	basket.total = appData.basket.total;
});

events.on('preview:change', (item: IProduct) => {
	if (item) {
		const card = new Card(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (appData.inBasket(item)) {
					appData.removeFromBasket(item);
					card.button = 'В корзину';
				} else {
					appData.addToBasket(item);
					card.button = 'Удалить из корзины';
				}
			},
		});

		if (appData.inBasket(item) == true) {
			card.button = 'Удалить из корзины';
		} else {
			card.button = 'В корзину';
		}
		
		modal.render({
			content: card.render(item),
		});
	} else {
		modal.close();
	}
});

api
	.getProductList()
	.then(appData.setItems.bind(appData))
	.catch((err) => {
		console.error(err);
	});
