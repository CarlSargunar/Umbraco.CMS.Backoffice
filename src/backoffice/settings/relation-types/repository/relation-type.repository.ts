import { UmbRelationTypeTreeStore, UMB_RELATION_TYPE_TREE_STORE_CONTEXT_TOKEN } from './relation-type.tree.store';
import { UmbRelationTypeServerDataSource } from './sources/relation-type.server.data';
import { UmbRelationTypeStore, UMB_RELATION_TYPE_STORE_CONTEXT_TOKEN } from './relation-type.store';
import { RelationTypeTreeServerDataSource } from './sources/relation-type.tree.server.data';
import { RelationTypeTreeDataSource } from './sources';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller';
import { UmbContextConsumerController } from '@umbraco-cms/backoffice/context-api';
import { ProblemDetailsModel, RelationTypeResponseModel } from '@umbraco-cms/backoffice/backend-api';
import { UmbDetailRepository, UmbTreeRepository } from '@umbraco-cms/backoffice/repository';
import { UmbNotificationContext, UMB_NOTIFICATION_CONTEXT_TOKEN } from '@umbraco-cms/backoffice/notification';

type ItemType = RelationTypeResponseModel;
type TreeItemType = any;

// Move to documentation / JSdoc
/* We need to create a new instance of the repository from within the element context. We want the notifications to be displayed in the right context. */
// element -> context -> repository -> (store) -> data source
// All methods should be async and return a promise. Some methods might return an observable as part of the promise response.
export class UmbRelationTypeRepository implements UmbTreeRepository<TreeItemType>, UmbDetailRepository<ItemType> {
	#init!: Promise<unknown>;

	#host: UmbControllerHostElement;

	#treeSource: RelationTypeTreeDataSource;
	#treeStore?: UmbRelationTypeTreeStore;

	#detailDataSource: UmbRelationTypeServerDataSource;
	#detailStore?: UmbRelationTypeStore;

	#notificationContext?: UmbNotificationContext;

	constructor(host: UmbControllerHostElement) {
		this.#host = host;

		// TODO: figure out how spin up get the correct data source
		this.#treeSource = new RelationTypeTreeServerDataSource(this.#host);
		this.#detailDataSource = new UmbRelationTypeServerDataSource(this.#host);

		this.#init = Promise.all([
			new UmbContextConsumerController(this.#host, UMB_RELATION_TYPE_TREE_STORE_CONTEXT_TOKEN, (instance) => {
				this.#treeStore = instance;
			}),

			new UmbContextConsumerController(this.#host, UMB_RELATION_TYPE_STORE_CONTEXT_TOKEN, (instance) => {
				this.#detailStore = instance;
			}),

			new UmbContextConsumerController(this.#host, UMB_NOTIFICATION_CONTEXT_TOKEN, (instance) => {
				this.#notificationContext = instance;
			}),
		]);
	}

	// TODO: Trash
	// TODO: Move

	async requestRootTreeItems() {
		await this.#init;

		const { data, error } = await this.#treeSource.getRootItems();

		if (data) {
			this.#treeStore?.appendItems(data.items);
		}

		return { data, error, asObservable: () => this.#treeStore!.rootItems };
	}

	//TODO RelationTypes can't have children. But this method is required by the tree interface.
	async requestTreeItemsOf(parentId: string | null) {
		const error: ProblemDetailsModel = { title: 'Not implemented' };
		return { data: undefined, error };
	}

	async requestTreeItems(ids: Array<string>) {
		await this.#init;

		if (!ids) {
			const error: ProblemDetailsModel = { title: 'Keys are missing' };
			return { data: undefined, error };
		}

		const { data, error } = await this.#treeSource.getItems(ids);

		return { data, error, asObservable: () => this.#treeStore!.items(ids) };
	}

	async rootTreeItems() {
		await this.#init;
		return this.#treeStore!.rootItems;
	}

	async treeItemsOf(parentId: string | null) {
		await this.#init;
		return this.#treeStore!.childrenOf(parentId);
	}

	async treeItems(ids: Array<string>) {
		await this.#init;
		return this.#treeStore!.items(ids);
	}

	// DETAILS:

	async createScaffold(parentId: string | null) {
		await this.#init;

		if (!parentId) {
			throw new Error('Parent id is missing');
		}

		return this.#detailDataSource.createScaffold(parentId);
	}

	async requestById(id: string) {
		await this.#init;

		// TODO: should we show a notification if the id is missing?
		// Investigate what is best for Acceptance testing, cause in that perspective a thrown error might be the best choice?
		if (!id) {
			const error: ProblemDetailsModel = { title: 'Key is missing' };
			return { error };
		}
		const { data, error } = await this.#detailDataSource.get(id);

		if (data) {
			this.#detailStore?.append(data);
		}

		return { data, error };
	}

	async byKey(id: string) {
		await this.#init;
		return this.#detailStore!.byKey(id);
	}

	// Could potentially be general methods:

	async create(template: ItemType) {
		await this.#init;

		if (!template || !template.id) {
			throw new Error('Template is missing');
		}

		const { error } = await this.#detailDataSource.insert(template);

		if (!error) {
			const notification = { data: { message: `Relation Type created` } };
			this.#notificationContext?.peek('positive', notification);
		}

		// TODO: we currently don't use the detail store for anything.
		// Consider to look up the data before fetching from the server
		this.#detailStore?.append(template);
		// TODO: Update tree store with the new item? or ask tree to request the new item?

		return { error };
	}

	async save(item: ItemType) {
		await this.#init;

		if (!item || !item.id) {
			throw new Error('Relation Type is missing');
		}

		const { error } = await this.#detailDataSource.update(item.id, item);

		if (!error) {
			const notification = { data: { message: `Relation Type saved` } };
			this.#notificationContext?.peek('positive', notification);
		}

		// TODO: we currently don't use the detail store for anything.
		// Consider to look up the data before fetching from the server
		// Consider notify a workspace if a template is updated in the store while someone is editing it.
		this.#detailStore?.append(item);
		this.#treeStore?.updateItem(item.id, { name: item.name });
		// TODO: would be nice to align the stores on methods/methodNames.

		return { error };
	}

	// General:

	async delete(id: string) {
		await this.#init;

		if (!id) {
			throw new Error('Relation Type id is missing');
		}

		const { error } = await this.#detailDataSource.delete(id);

		if (!error) {
			const notification = { data: { message: `Relation Type deleted` } };
			this.#notificationContext?.peek('positive', notification);
		}

		// TODO: we currently don't use the detail store for anything.
		// Consider to look up the data before fetching from the server.
		// Consider notify a workspace if a template is deleted from the store while someone is editing it.
		this.#detailStore?.remove([id]);
		this.#treeStore?.removeItem(id);
		// TODO: would be nice to align the stores on methods/methodNames.

		return { error };
	}
}