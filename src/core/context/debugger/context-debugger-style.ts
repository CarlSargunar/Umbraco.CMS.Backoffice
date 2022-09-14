import { css } from 'lit';

export const styles = [
	css`
		.json-formatter-row {
			font-family: monospace;
		}
		.json-formatter-row,
		.json-formatter-row a,
		.json-formatter-row a:hover {
			color: black;
			text-decoration: none;
		}
		.json-formatter-row .json-formatter-row {
			margin-left: 1rem;
		}
		.json-formatter-row .json-formatter-children.json-formatter-empty {
			opacity: 0.5;
			margin-left: 1rem;
		}
		.json-formatter-row .json-formatter-children.json-formatter-empty:after {
			display: none;
		}
		.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-object:after {
			content: 'No properties';
		}
		.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-array:after {
			content: '[]';
		}
		.json-formatter-row .json-formatter-string,
		.json-formatter-row .json-formatter-stringifiable {
			color: green;
			white-space: pre;
			word-wrap: break-word;
		}
		.json-formatter-row .json-formatter-number {
			color: blue;
		}
		.json-formatter-row .json-formatter-boolean {
			color: red;
		}
		.json-formatter-row .json-formatter-null {
			color: #855a00;
		}
		.json-formatter-row .json-formatter-undefined {
			color: #ca0b69;
		}
		.json-formatter-row .json-formatter-function {
			color: #ff20ed;
		}
		.json-formatter-row .json-formatter-date {
			background-color: rgba(0, 0, 0, 0.05);
		}
		.json-formatter-row .json-formatter-url {
			text-decoration: underline;
			color: blue;
			cursor: pointer;
		}
		.json-formatter-row .json-formatter-bracket {
			color: blue;
		}
		.json-formatter-row .json-formatter-key {
			color: #00008b;
			padding-right: 0.2rem;
		}
		.json-formatter-row .json-formatter-toggler-link {
			cursor: pointer;
		}
		.json-formatter-row .json-formatter-toggler {
			line-height: 1.2rem;
			font-size: 0.7rem;
			vertical-align: middle;
			opacity: 0.6;
			cursor: pointer;
			padding-right: 0.2rem;
		}
		.json-formatter-row .json-formatter-toggler:after {
			display: inline-block;
			transition: transform 100ms ease-in;
			content: '►';
		}
		.json-formatter-row > a > .json-formatter-preview-text {
			opacity: 0;
			transition: opacity 0.15s ease-in;
			font-style: italic;
		}
		.json-formatter-row:hover > a > .json-formatter-preview-text {
			opacity: 0.6;
		}
		.json-formatter-row.json-formatter-open > .json-formatter-toggler-link .json-formatter-toggler:after {
			transform: rotate(90deg);
		}
		.json-formatter-row.json-formatter-open > .json-formatter-children:after {
			display: inline-block;
		}
		.json-formatter-row.json-formatter-open > a > .json-formatter-preview-text {
			display: none;
		}
		.json-formatter-row.json-formatter-open.json-formatter-empty:after {
			display: block;
		}
		.json-formatter-dark.json-formatter-row {
			font-family: monospace;
		}
		.json-formatter-dark.json-formatter-row,
		.json-formatter-dark.json-formatter-row a,
		.json-formatter-dark.json-formatter-row a:hover {
			color: white;
			text-decoration: none;
		}
		.json-formatter-dark.json-formatter-row .json-formatter-row {
			margin-left: 1rem;
		}
		.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty {
			opacity: 0.5;
			margin-left: 1rem;
		}
		.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty:after {
			display: none;
		}
		.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-object:after {
			content: 'No properties';
		}
		.json-formatter-dark.json-formatter-row .json-formatter-children.json-formatter-empty.json-formatter-array:after {
			content: '[]';
		}
		.json-formatter-dark.json-formatter-row .json-formatter-string,
		.json-formatter-dark.json-formatter-row .json-formatter-stringifiable {
			color: #31f031;
			white-space: pre;
			word-wrap: break-word;
		}
		.json-formatter-dark.json-formatter-row .json-formatter-number {
			color: #66c2ff;
		}
		.json-formatter-dark.json-formatter-row .json-formatter-boolean {
			color: #ec4242;
		}
		.json-formatter-dark.json-formatter-row .json-formatter-null {
			color: #eec97d;
		}
		.json-formatter-dark.json-formatter-row .json-formatter-undefined {
			color: #ef8fbe;
		}
		.json-formatter-dark.json-formatter-row .json-formatter-function {
			color: #fd48cb;
		}
		.json-formatter-dark.json-formatter-row .json-formatter-date {
			background-color: rgba(255, 255, 255, 0.05);
		}
		.json-formatter-dark.json-formatter-row .json-formatter-url {
			text-decoration: underline;
			color: #027bff;
			cursor: pointer;
		}
		.json-formatter-dark.json-formatter-row .json-formatter-bracket {
			color: #9494ff;
		}
		.json-formatter-dark.json-formatter-row .json-formatter-key {
			color: #23a0db;
			padding-right: 0.2rem;
		}
		.json-formatter-dark.json-formatter-row .json-formatter-toggler-link {
			cursor: pointer;
		}
		.json-formatter-dark.json-formatter-row .json-formatter-toggler {
			line-height: 1.2rem;
			font-size: 0.7rem;
			vertical-align: middle;
			opacity: 0.6;
			cursor: pointer;
			padding-right: 0.2rem;
		}
		.json-formatter-dark.json-formatter-row .json-formatter-toggler:after {
			display: inline-block;
			transition: transform 100ms ease-in;
			content: '►';
		}
		.json-formatter-dark.json-formatter-row > a > .json-formatter-preview-text {
			opacity: 0;
			transition: opacity 0.15s ease-in;
			font-style: italic;
		}
		.json-formatter-dark.json-formatter-row:hover > a > .json-formatter-preview-text {
			opacity: 0.6;
		}
		.json-formatter-dark.json-formatter-row.json-formatter-open
			> .json-formatter-toggler-link
			.json-formatter-toggler:after {
			transform: rotate(90deg);
		}
		.json-formatter-dark.json-formatter-row.json-formatter-open > .json-formatter-children:after {
			display: inline-block;
		}
		.json-formatter-dark.json-formatter-row.json-formatter-open > a > .json-formatter-preview-text {
			display: none;
		}
		.json-formatter-dark.json-formatter-row.json-formatter-open.json-formatter-empty:after {
			display: block;
		}
	`,
];
