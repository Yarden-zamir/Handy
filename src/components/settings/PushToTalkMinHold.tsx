import React from "react";
import { useTranslation } from "react-i18next";
import { Slider } from "../ui/Slider";
import { useSettings } from "../../hooks/useSettings";

interface PushToTalkMinHoldProps {
  descriptionMode?: "tooltip" | "inline";
  grouped?: boolean;
}

/** Hold mode only: presses shorter than this record nothing. */
export const PushToTalkMinHold: React.FC<PushToTalkMinHoldProps> = ({
  descriptionMode = "tooltip",
  grouped = false,
}) => {
  const { t } = useTranslation();
  const { settings, updateSetting, resetSetting, isUpdating } = useSettings();

  return (
    <Slider
      value={settings?.push_to_talk_min_hold_ms ?? 0}
      onChange={(value) => updateSetting("push_to_talk_min_hold_ms", value)}
      onReset={() => resetSetting("push_to_talk_min_hold_ms")}
      isResetting={isUpdating("push_to_talk_min_hold_ms")}
      min={0}
      max={1000}
      step={50}
      label={t("settings.general.pushToTalkMinHold.title")}
      description={t("settings.general.pushToTalkMinHold.description")}
      descriptionMode={descriptionMode}
      grouped={grouped}
      formatValue={(v) =>
        v === 0 ? t("settings.general.pushToTalkMinHold.off") : `${v}ms`
      }
    />
  );
};
