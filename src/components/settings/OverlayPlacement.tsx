import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { SettingContainer } from "../ui/SettingContainer";
import { Slider } from "../ui/Slider";
import { useSettings } from "../../hooks/useSettings";
import { commands, type OverlayAnchor } from "@/bindings";

// Roughly where the default spot sits, so the sliders start near the pill.
const DEFAULT_ANCHOR = {
  top: { x: 0.5, y: 0.04 },
  bottom: { x: 0.5, y: 0.97 },
} as const;

interface OverlayPlacementProps {
  descriptionMode?: "inline" | "tooltip";
  grouped?: boolean;
}

/** Custom overlay spot: drag the pill (via "Move"), or set it with sliders. */
export const OverlayPlacement: React.FC<OverlayPlacementProps> = ({
  descriptionMode = "tooltip",
  grouped = false,
}) => {
  const { t } = useTranslation();
  const { getSetting, updateSetting } = useSettings();
  const [moving, setMoving] = useState(false);

  const anchor = getSetting("overlay_anchor") ?? null;
  const edge = getSetting("overlay_position") === "top" ? "top" : "bottom";
  const shown = anchor ?? DEFAULT_ANCHOR[edge];

  // Hide the preview overlay if the settings page closes while moving.
  useEffect(() => {
    if (!moving) return;
    return () => {
      void commands.setOverlayPositioning(false);
    };
  }, [moving]);

  const toggleMoving = async () => {
    const result = await commands.setOverlayPositioning(!moving);
    if (result.status === "error") {
      toast.error(result.error);
      return;
    }
    setMoving(!moving);
  };

  const setAnchor = (next: OverlayAnchor | null) =>
    updateSetting("overlay_anchor", next);

  const percent = (value: number) => `${Math.round(value)}%`;

  return (
    <>
      <SettingContainer
        title={t("settings.advanced.overlay.placement.title")}
        description={t("settings.advanced.overlay.placement.description")}
        descriptionMode={descriptionMode}
        grouped={grouped}
      >
        <div className="flex items-center gap-2">
          <Button
            variant={moving ? "primary" : "secondary"}
            size="sm"
            onClick={toggleMoving}
          >
            {moving
              ? t("settings.advanced.overlay.placement.done")
              : t("settings.advanced.overlay.placement.move")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAnchor(null)}
            disabled={anchor === null}
          >
            {t("settings.advanced.overlay.placement.reset")}
          </Button>
        </div>
      </SettingContainer>
      <Slider
        value={shown.x * 100}
        onChange={(value) => setAnchor({ x: value / 100, y: shown.y })}
        min={0}
        max={100}
        step={1}
        label={t("settings.advanced.overlay.placement.horizontal")}
        description={t("settings.advanced.overlay.placement.horizontalHint")}
        descriptionMode={descriptionMode}
        grouped={grouped}
        formatValue={percent}
      />
      <Slider
        value={shown.y * 100}
        onChange={(value) => setAnchor({ x: shown.x, y: value / 100 })}
        min={0}
        max={100}
        step={1}
        label={t("settings.advanced.overlay.placement.vertical")}
        description={t("settings.advanced.overlay.placement.verticalHint")}
        descriptionMode={descriptionMode}
        grouped={grouped}
        formatValue={percent}
      />
    </>
  );
};
