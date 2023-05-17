import { UUITextStyles } from '@umbraco-ui/uui-css';
import { UmbDictionaryRepository } from '../repository/dictionary.repository';
import { UmbEntityActionBase } from '@umbraco-cms/backoffice/components';
import { UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';

export default class UmbReloadDictionaryEntityAction extends UmbEntityActionBase<UmbDictionaryRepository> {
	static styles = [UUITextStyles];

	constructor(host: UmbControllerHostElement, repositoryAlias: string, unique: string) {
		super(host, repositoryAlias, unique);
	}

	async execute() {
		alert('refresh');
	}
}
