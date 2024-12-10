import { IOSConfig, withPlugins, type ConfigPlugin } from "expo/config-plugins";

import { withDeviceFamily } from "@expo/config-plugins/build/ios/DeviceFamily";
import { withConfig } from "./withConfig";
import { withEntitlements } from "./withEntitlements";
import { withPlist } from "./withPlist";
import { withPodfile } from "./withPodfile";
import { withXcode } from "./withXcode";

const withAppClip: ConfigPlugin<{
  name?: string;
  enabled?: boolean;
  bundleIdSuffix?: string;
  targetSuffix?: string;
  groupIdentifier?: string;
  deploymentTarget?: string;
  requestEphemeralUserNotification?: boolean;
  requestLocationConfirmation?: boolean;
  appleSignin?: boolean;
  applePayMerchantIds?: string[];
  excludedPackages?: string[];
  pushNotifications?: boolean;
  nfcScanning?: boolean;
}> = (
  config,
  {
    name,
    enabled,
    bundleIdSuffix,
    targetSuffix,
    groupIdentifier,
    deploymentTarget,
    requestEphemeralUserNotification,
    requestLocationConfirmation,
    appleSignin,
    applePayMerchantIds,
    excludedPackages,
    pushNotifications,
    nfcScanning,
  } = {}
) => {
  name ??= "Clip";
  bundleIdSuffix ??= "Clip";
  targetSuffix ??= "Clip";
  deploymentTarget ??= "15.1";
  requestEphemeralUserNotification ??= false;
  requestLocationConfirmation ??= false;
  appleSignin ??= false;
  enabled ??= true;
  pushNotifications ??= false;
  nfcScanning ??= false;

  if (!enabled) {
    return config;
  }
  if (!config.ios?.bundleIdentifier) {
    throw new Error("No bundle identifier specified in app config");
  }

  const bundleIdentifier = `${config.ios.bundleIdentifier}.${bundleIdSuffix}`;
  const targetName = `${IOSConfig.XcodeUtils.sanitizedName(
    config.name
  )}${targetSuffix}`;

  const modifiedConfig = withPlugins(config, [
    withDeviceFamily as ConfigPlugin,
    [
      withConfig,
      {
        targetName,
        bundleIdentifier,
        appleSignin,
        applePayMerchantIds,
        pushNotifications,
        nfcScanning,
      },
    ],
    [
      withEntitlements,
      {
        targetName,
        groupIdentifier,
        appleSignin,
        applePayMerchantIds,
        pushNotifications,
        nfcScanning,
      },
    ],
    [withPodfile, { targetName, excludedPackages }],
    [
      withPlist,
      {
        targetName,
        deploymentTarget,
        requestEphemeralUserNotification,
        requestLocationConfirmation,
      },
    ],
    [
      withXcode,
      {
        name,
        targetName,
        bundleIdentifier,
        deploymentTarget,
      },
    ],
  ]);

  return modifiedConfig;
};

export default withAppClip;
