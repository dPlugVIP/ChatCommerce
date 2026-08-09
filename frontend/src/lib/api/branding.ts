import type { BusinessSettings } from "@/types";

import { bff } from "./client";
import {
  mapBusinessSettings,
  type BackendBusinessSettings,
} from "./contracts";

export const fallbackBranding: BusinessSettings = {
  name: "DplugVIP",
  supportEmail: "hello@dplugvip.com",
  replyTime: "Typically replies in 5 minutes",
  primaryColor: "#00e7f2",
};

export async function getPublicBranding(): Promise<BusinessSettings> {
  try {
    return mapBusinessSettings(await bff<BackendBusinessSettings>("public/settings"));
  } catch {
    return fallbackBranding;
  }
}
