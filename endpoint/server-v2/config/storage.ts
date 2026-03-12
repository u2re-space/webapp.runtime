import legacyConfig, {
    DEFAULT_SETTINGS,
    createSettingsStore,
    getConfigLoadReportSnapshot,
    mergeSettings,
    readCoreSettings,
    writeCoreSettings
} from "../../server/config/config.ts";

export type ServerV2ConfigSnapshot = Record<string, any>;

export const readServerV2ConfigSnapshot = (): ServerV2ConfigSnapshot => {
    return {
        ...(legacyConfig || {})
    };
};

export const createServerV2ConfigStorage = () => {
    const readSnapshot = (): ServerV2ConfigSnapshot => readServerV2ConfigSnapshot();

    return {
        defaults: DEFAULT_SETTINGS,
        getLoadReport: () => getConfigLoadReportSnapshot(),
        mergeSettings,
        readCoreSettings,
        readSnapshot,
        settingsStore: createSettingsStore(undefined, DEFAULT_SETTINGS),
        writeCoreSettings
    };
};

export {
    DEFAULT_SETTINGS,
    createSettingsStore,
    getConfigLoadReportSnapshot,
    mergeSettings,
    readCoreSettings,
    writeCoreSettings
};
