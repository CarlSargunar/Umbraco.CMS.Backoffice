import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { html, customElement, state, repeat, css, until } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbMemberTypeTreeRepository } from '@umbraco-cms/backoffice/member-type';

@customElement('umb-create-member-collection-action')
export class UmbCreateDocumentCollectionActionElement extends UmbLitElement {
	@state()
	private _options: Array<{ label: string; unique: string; icon: string }> = [];

	#memberTypeCollectionRepository = new UmbMemberTypeTreeRepository(this);
	#optionRequestPromise?: Promise<void>;

	async #getOptions() {
		//TODO: Should we use the tree repository or make a collection repository?
		//TODO: And how would we get all the member types?
		//TODO: This only works because member types can't have folders.
		const { data } = await this.#memberTypeCollectionRepository.requestRootTreeItems();
		if (!data) return;

		this._options = data.items.map((item) => {
			return {
				label: item.name,
				unique: item.unique,
				icon: item.icon || '',
			};
		});
		this.requestUpdate();
	}

	#onButtonClick = () => {
		if (this._options.length > 0) return;

		this.#getOptions();
	};

	async #renderOptions() {
		await this.#optionRequestPromise;

		return html`
			${repeat(
				this._options,
				(option) => option.unique,
				(option) =>
					html`<uui-button
						compact
						label=${option.label}
						href="section/member-management/workspace/member/create/${option.unique}">
						<uui-icon name=${option.icon}></uui-icon>
						<span style="margin-left: var(--uui-size-space-2)">${option.label}</span>
					</uui-button>`,
			)}
		`;
	}

	render() {
		return html`
			<uui-button
				label="Create"
				@click=${this.#onButtonClick}
				look="outline"
				popovertarget="create-popover"></uui-button>
			<uui-popover-container id="create-popover">
				<div id="popover-content">${until(this.#renderOptions(), html`<uui-loader></uui-loader>`)}</div>
			</uui-popover-container>
		`;
	}

	static styles = [
		UmbTextStyles,
		css`
			#popover-content {
				background-color: var(--uui-color-surface);
				box-shadow: var(--uui-shadow-depth-3);
				border-radius: var(--uui-border-radius);
				display: flex;
				flex-direction: column;
				--uui-button-content-align: left;
			}
		`,
	];
}

export default UmbCreateDocumentCollectionActionElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-create-member-collection-action': UmbCreateDocumentCollectionActionElement;
	}
}
