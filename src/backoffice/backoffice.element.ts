import './components/backoffice-header.element';
import './components/backoffice-main.element';
import './components/backoffice-modal-container.element';
import './components/backoffice-notification-container.element';
import './components/editor-property-layout.element';
import './components/node-property.element';
import './sections/shared/section-layout.element';
import './sections/shared/section-main.element';
import './sections/shared/section-sidebar.element';

import '../core/context/context-debugger.element';

import { defineElement } from '@umbraco-ui/uui-base/lib/registration';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, LitElement } from 'lit';

import { UmbContextConsumerMixin, UmbContextProviderMixin } from '../core/context';
import { UmbModalService } from '../core/services/modal';
import { UmbNotificationService } from '../core/services/notification';
import { UmbDataTypeStore } from '../core/stores/data-type.store';
import { UmbDocumentTypeStore } from '../core/stores/document-type.store';
import { UmbNodeStore } from '../core/stores/node.store';
import { UmbSectionStore } from '../core/stores/section.store';

import type { Subscription } from 'rxjs';
import { UmbContextAtlas } from '../core/context/context-atlas';

@defineElement('umb-backoffice')
export default class UmbBackoffice extends UmbContextConsumerMixin(UmbContextProviderMixin(LitElement)) {
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

	private _umbSectionStore?: UmbSectionStore;
	private _currentSectionSubscription?: Subscription;

	constructor() {
		super();

		this.provideContext(UmbContextAtlas.NodeStore, new UmbNodeStore());
		this.provideContext(UmbContextAtlas.DataTypeStore, new UmbDataTypeStore());
		this.provideContext(UmbContextAtlas.DocumentTypeStore, new UmbDocumentTypeStore());
		this.provideContext('umbNotificationService', new UmbNotificationService());
		this.provideContext('umbModalService', new UmbModalService());

		// TODO: how do we want to handle context aware DI?
		this.consumeContext('umbExtensionRegistry', (extensionRegistry) => {
			this._umbSectionStore = new UmbSectionStore(extensionRegistry);
			this.provideContext(UmbContextAtlas.SectionStore, this._umbSectionStore);
		});
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this._currentSectionSubscription?.unsubscribe();
	}

	render() {
		return html`
			<umb-context-debugger>
				<umb-backoffice-header></umb-backoffice-header>
				<umb-backoffice-main></umb-backoffice-main>
				<umb-backoffice-notification-container></umb-backoffice-notification-container>
				<umb-backoffice-modal-container></umb-backoffice-modal-container>
			</umb-context-debugger>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-backoffice': UmbBackoffice;
	}
}
