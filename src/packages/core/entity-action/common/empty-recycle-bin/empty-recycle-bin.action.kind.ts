import { UMB_ENTITY_ACTION_DEFAULT_KIND_MANIFEST } from '../../default/default.action.kind.js';
import type { UmbBackofficeManifestKind } from '@umbraco-cms/backoffice/extension-registry';

export const manifest: UmbBackofficeManifestKind = {
	type: 'kind',
	alias: 'Umb.Kind.EntityAction.RecycleBin.Empty',
	matchKind: 'emptyRecycleBin',
	matchType: 'entityAction',
	manifest: {
		...UMB_ENTITY_ACTION_DEFAULT_KIND_MANIFEST.manifest,
		type: 'entityAction',
		kind: 'emptyRecycleBin',
		api: () => import('./empty-recycle-bin.action.js'),
		weight: 100,
		forEntityTypes: [],
		meta: {
			icon: 'icon-trash',
			label: 'Empty...',
		},
	},
};
