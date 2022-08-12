import { defineElement } from '@umbraco-ui/uui-base/lib/registration';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, LitElement } from 'lit';

import { UmbContextProviderMixin } from 'umbraco/context';
import { UmbNotificationService } from '../core/services/notification';
import { UmbModalService } from '../core/services/modal';
import { UmbDataTypeStore, UmbDocumentTypeStore, UmbNodeStore } from 'umbraco/stores';

import './components/backoffice-header.element';
import './components/backoffice-main.element';
import './components/backoffice-notification-container.element';
import './components/backoffice-modal-container.element';
import './components/editor-property-layout.element';
import './components/node-property.element';
import './components/section-layout.element';
import './components/section-sidebar.element';
import './components/section-main.element';

@defineElement('umb-backoffice')
export default class UmbBackoffice extends UmbContextProviderMixin(LitElement) {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: flex;
				flex-direction: column;
				height: 100%;
				width: 100%;
				color: var(--uui-color-text);
				font-size: 14px;
				box-sizing: border-box;
			}
		`,
	];

	constructor() {
		super();

		this.provideContext('umbNodeStore', new UmbNodeStore());
		this.provideContext('umbDataTypeStore', new UmbDataTypeStore());
		this.provideContext('umbDocumentTypeStore', new UmbDocumentTypeStore());
		this.provideContext('umbNotificationService', new UmbNotificationService());
		this.provideContext('umbModalService', new UmbModalService());
	}

	render() {
		return html`
			<umb-backoffice-header></umb-backoffice-header>
			<umb-backoffice-main></umb-backoffice-main>
			<umb-backoffice-notification-container></umb-backoffice-notification-container>
			<umb-backoffice-modal-container></umb-backoffice-modal-container>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-backoffice': UmbBackoffice;
	}
}
