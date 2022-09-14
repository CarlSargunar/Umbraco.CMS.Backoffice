import { css, html, LitElement } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, state } from 'lit/decorators.js';
import type { ManifestTreeItemAction, ManifestTree } from '../../../../core/models';
import { UmbExtensionRegistry } from '../../../../core/extension';
import { UmbContextConsumerMixin } from '../../../../core/context';
import { map, Subscription } from 'rxjs';
import { UmbSectionContext } from '../../../sections/section.context';
import { Entity } from '../../../../mocks/data/entities';

@customElement('umb-tree-context-menu-page-action-list')
export class UmbTreeContextMenuPageActionListElement extends UmbContextConsumerMixin(LitElement) {
	static styles = [
		UUITextStyles,
		css`
			#title {
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding: 0 var(--uui-size-4);
				height: 70px;
				box-sizing: border-box;
				border-bottom: 1px solid var(--uui-color-divider-standalone);
			}
			#title > * {
				margin: 0;
			}
		`,
	];

	@state()
	private _actions: Array<ManifestTreeItemAction> = [];

	@state()
	private _activeTree?: ManifestTree;

	@state()
	private _activeTreeItem?: Entity;

	private _extensionRegistry?: UmbExtensionRegistry;
	private _sectionContext?: UmbSectionContext;

	private _treeItemActionsSubscription?: Subscription;
	private _activeTreeSubscription?: Subscription;
	private _activeTreeItemSubscription?: Subscription;

	connectedCallback() {
		super.connectedCallback();

		this.consumeContext('umbExtensionRegistry', (extensionRegistry) => {
			this._extensionRegistry = extensionRegistry;
			this._observeTreeItemActions();
		});

		this.consumeContext('umbSectionContext', (sectionContext) => {
			this._sectionContext = sectionContext;
			this._observeActiveTree();
			this._observeActiveTreeItem();
			this._observeTreeItemActions();
		});
	}

	private _observeTreeItemActions() {
		if (!this._extensionRegistry || !this._sectionContext) return;

		this._treeItemActionsSubscription?.unsubscribe();

		this._treeItemActionsSubscription = this._extensionRegistry
			?.extensionsOfType('treeItemAction')
			.pipe(map((actions) => actions.filter((action) => action.meta.trees.includes(this._activeTree?.alias || ''))))
			.subscribe((actions) => {
				this._actions = actions;
			});
	}

	private _observeActiveTree() {
		this._activeTreeSubscription?.unsubscribe();

		this._activeTreeSubscription = this._sectionContext?.activeTree.subscribe((tree) => {
			this._activeTree = tree;
		});
	}

	private _observeActiveTreeItem() {
		this._activeTreeItemSubscription?.unsubscribe();

		this._activeTreeItemSubscription = this._sectionContext?.activeTreeItem.subscribe((treeItem) => {
			this._activeTreeItem = treeItem;
		});
	}

	private _renderActions() {
		return this._actions
			.sort((a, b) => a.meta.weight - b.meta.weight)
			.map((action) => {
				return html`<umb-tree-item-action-extension .treeAction=${action}></umb-tree-item-action-extension> `;
			});
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this._treeItemActionsSubscription?.unsubscribe();
		this._activeTreeSubscription?.unsubscribe();
		this._activeTreeItemSubscription?.unsubscribe();
	}

	render() {
		return html`
			<div id="title">
				<h3>${this._activeTreeItem?.name}</h3>
			</div>
			<div id="action-list">${this._renderActions()}</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-tree-context-menu-page-action-list': UmbTreeContextMenuPageActionListElement;
	}
}
