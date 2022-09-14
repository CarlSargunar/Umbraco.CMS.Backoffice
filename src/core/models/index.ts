import type { components } from '../../../schemas/generated-schema';

export type PostInstallRequest = components['schemas']['InstallSetupRequest'];
export type StatusResponse = components['schemas']['StatusResponse'];
export type VersionResponse = components['schemas']['VersionResponse'];
export type ProblemDetails = components['schemas']['ProblemDetails'];
export type UserResponse = components['schemas']['UserResponse'];
export type AllowedSectionsResponse = components['schemas']['AllowedSectionsResponse'];
export type UmbracoInstaller = components['schemas']['InstallSettingsResponse'];
export type UmbracoUpgrader = components['schemas']['UpgradeSettingsResponse'];
export type ManifestsResponse = components['schemas']['ManifestsResponse'];
export type ManifestsPackagesInstalledResponse = components['schemas']['ManifestsPackagesInstalledResponse'];

// Models
export type UmbracoPerformInstallDatabaseConfiguration = components['schemas']['InstallSetupDatabaseConfiguration'];
export type UmbracoInstallerDatabaseModel = components['schemas']['InstallDatabaseModel'];
export type UmbracoInstallerUserModel = components['schemas']['InstallUserModel'];
export type TelemetryModel = components['schemas']['TelemetryModel'];
export type ServerStatus = components['schemas']['ServerStatus'];
export type ManifestTypes = components['schemas']['Manifest'];
export type ManifestSection = components['schemas']['IManifestSection'];
export type ManifestTree = components['schemas']['IManifestTree'];
export type ManifestTreeItemAction = components['schemas']['IManifestTreeItemAction'];
export type ManifestEditor = components['schemas']['IManifestEditor'];
export type ManifestPropertyEditorUI = components['schemas']['IManifestPropertyEditorUI'];
export type ManifestDashboard = components['schemas']['IManifestDashboard'];
export type ManifestEditorView = components['schemas']['IManifestEditorView'];
export type ManifestPropertyAction = components['schemas']['IManifestPropertyAction'];
export type ManifestEntrypoint = components['schemas']['IManifestEntrypoint'];
export type ManifestCustom = components['schemas']['IManifestCustom'];
export type ManifestPackageView = components['schemas']['IManifestPackageView'];
export type PackageInstalled = components['schemas']['PackageInstalled'];

export type ManifestElementType =
	| ManifestSection
	| ManifestTree
	| ManifestTreeItemAction
	| ManifestEditor
	| ManifestPropertyAction
	| ManifestPropertyEditorUI
	| ManifestDashboard
	| ManifestEditorView
	| ManifestPackageView;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HTMLElementConstructor<T = HTMLElement> = new (...args: any[]) => T;
