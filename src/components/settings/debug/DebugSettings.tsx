import React from "react";
import { useTranslation } from "react-i18next";
import { LogLevelSelector } from "./LogLevelSelector";
import { LiveLogViewer } from "./LiveLogViewer";
import { SettingsGroup } from "../../ui/SettingsGroup";
import { WhatsNewPreview } from "./WhatsNewPreview";
import { KeyboardDiagnostic } from "./KeyboardDiagnostic";
import { DebugRun, OnboardingPreview } from "./OnboardingPreview";
import type { OnboardingStep } from "../../onboarding/onboardingStore";

interface DebugSettingsProps {
  onPreviewOnboarding: (step: OnboardingStep) => void;
  onRunOnboarding: () => void;
  onRunModelMigration: () => void;
}

export const DebugSettings: React.FC<DebugSettingsProps> = ({
  onPreviewOnboarding,
  onRunOnboarding,
  onRunModelMigration,
}) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl w-full mx-auto space-y-6">
      <SettingsGroup title={t("settings.debug.title")}>
        <LogLevelSelector grouped={true} />
        <WhatsNewPreview descriptionMode="tooltip" grouped={true} />
        <OnboardingPreview
          onPreview={onPreviewOnboarding}
          descriptionMode="tooltip"
          grouped={true}
        />
        <DebugRun
          run="onboardingRun"
          onRun={onRunOnboarding}
          descriptionMode="tooltip"
          grouped={true}
        />
        <DebugRun
          run="modelMigration"
          onRun={onRunModelMigration}
          descriptionMode="tooltip"
          grouped={true}
        />
        <KeyboardDiagnostic />
        <LiveLogViewer descriptionMode="tooltip" grouped={true} />
      </SettingsGroup>
    </div>
  );
};
