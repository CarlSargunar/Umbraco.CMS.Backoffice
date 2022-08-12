import { css, html, LitElement } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { UmbContextConsumerMixin } from 'umbraco/context';
import { UmbNodeStore } from 'umbraco/stores';
import { map, Subscription } from 'rxjs';

@customElement('umb-media-section-tree')
class UmbMediaSectionTree extends UmbContextConsumerMixin(LitElement) {
	static styles = [
		UUITextStyles,
		css`
			h3 {
				padding: var(--uui-size-4) var(--uui-size-8);
			}
		`,
	];

	@property()
	public currentNodeId?: string;

	// simplified tree data for testing
	@state()
	_tree: Array<any> = [];

	@state()
	_section?: string;

	private _nodeStore?: UmbNodeStore;
	private _nodesSubscription?: Subscription;

	constructor() {
		super();

		// TODO: temp solution until we know where to get tree data from
		this.consumeContext('umbNodeStore', (store) => {
			this._nodeStore = store;

			this._nodesSubscription = this._nodeStore
				?.getAll()
				.pipe(map((nodes) => nodes.filter((node) => node.type === 'media')))
				.subscribe((mediaNodes) => {
					this._tree = mediaNodes;
				});
		});
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this._nodesSubscription?.unsubscribe();
	}

	render() {
		return html`
			<a href="${'/section/media'}">
				<h3>Media</h3>
			</a>

			<div class="nav-list">
				${this._tree.map(
					(item) => html`
						<uui-menu-item
							?active="${parseInt(this.currentNodeId || '-1') === item.id}"
							label="${item.name}"
							href="/section/media/node/${item.id}">
							<uui-icon slot="icon" name="${item.icon}"></uui-icon>
						</uui-menu-item>
					`
				)}
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-media-section-tree': UmbMediaSectionTree;
	}
}
