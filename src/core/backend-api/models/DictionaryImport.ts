/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DictionaryItemsImport } from './DictionaryItemsImport';

export type DictionaryImport = {
    dictionaryItems?: Array<DictionaryItemsImport> | null;
    tempFileName?: string | null;
};
