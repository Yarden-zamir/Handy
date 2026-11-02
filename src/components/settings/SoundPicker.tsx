import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { open } from "@tauri-apps/plugin-dialog";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { Dropdown, DropdownOption } from "../ui/Dropdown";
import { CheckIcon, PlayIcon } from "lucide-react";
import { SettingContainer } from "../ui/SettingContainer";
import { useSettingsStore } from "../../stores/settingsStore";
import { useSettings } from "../../hooks/useSettings";
import { commands, type CustomSoundSlot } from "@/bindings";

// Formats rodio decodes in this build (wav, flac, mp3, vorbis).
const SOUND_EXTENSIONS = ["wav", "mp3", "flac", "ogg"];

interface SoundPickerProps {
  label: string;
  description: string;
}

export const SoundPicker: React.FC<SoundPickerProps> = ({
  label,
  description,
}) => {
  const { t } = useTranslation();
  const { getSetting, updateSetting } = useSettings();
  const playTestSound = useSettingsStore((state) => state.playTestSound);
  const customSounds = useSettingsStore((state) => state.customSounds);
  const checkCustomSounds = useSettingsStore(
    (state) => state.checkCustomSounds,
  );

  const selectedTheme = getSetting("sound_theme") ?? "marimba";

  useEffect(() => {
    checkCustomSounds();
  }, [checkCustomSounds]);

  const options: DropdownOption[] = [
    { value: "marimba", label: "Marimba" },
    { value: "pop", label: "Pop" },
  ];

  options.push({ value: "custom", label: "Custom" });

  const handlePlayBothSounds = async () => {
    await playTestSound("start");
    await playTestSound("stop");
  };

  const chooseCustomSound = async (slot: CustomSoundSlot) => {
    const selected = await open({
      multiple: false,
      directory: false,
      filters: [
        {
          name: t("settings.debug.soundTheme.audioFiles"),
          extensions: SOUND_EXTENSIONS,
        },
      ],
    });
    if (typeof selected !== "string") return;
    const result = await commands.setCustomSound(slot, selected);
    if (result.status === "error") {
      toast.error(result.error);
      return;
    }
    await checkCustomSounds();
    await playTestSound(slot);
  };

  return (
    <SettingContainer
      title={label}
      description={description}
      grouped
      layout="horizontal"
    >
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <Dropdown
            selectedValue={selectedTheme}
            onSelect={(value) =>
              updateSetting(
                "sound_theme",
                value as "marimba" | "pop" | "custom",
              )
            }
            options={options}
            onOpen={checkCustomSounds}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePlayBothSounds}
            title="Preview sound theme (plays start then stop)"
          >
            <PlayIcon className="h-4 w-4" />
          </Button>
        </div>
        {selectedTheme === "custom" && (
          <div className="flex items-center gap-2">
            {(["start", "stop"] as const).map((slot) => (
              <Button
                key={slot}
                variant="secondary"
                size="sm"
                onClick={() => chooseCustomSound(slot)}
              >
                <span className="flex items-center gap-1">
                  {customSounds[slot] && <CheckIcon className="h-3 w-3" />}
                  {t(`settings.debug.soundTheme.choose.${slot}`)}
                </span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </SettingContainer>
  );
};
