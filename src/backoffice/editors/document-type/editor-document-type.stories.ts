import './editor-document-type.element';

import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit-html';

import { data } from '../../../mocks/data/document-type.data';

import type { UmbEditorDocumentTypeElement } from './editor-document-type.element';

export default {
	title: 'Editors/Document Type',
	component: 'umb-editor-document-type',
	id: 'umb-editor-document-type',
} as Meta;

export const AAAOverview: Story<UmbEditorDocumentTypeElement> = () =>
	html` <umb-editor-document-type id="${data[0].key}"></umb-editor-document-type>`;
AAAOverview.storyName = 'Overview';
