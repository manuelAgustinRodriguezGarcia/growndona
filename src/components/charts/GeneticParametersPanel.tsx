"use client";

import { useState } from "react";
import type { GeneticSeries } from "@/lib/utils/measurements";
import { Select } from "@/components/ui/Select";
import { MeasurementChart } from "./MeasurementChart";

const GENERAL_VALUE = "__general__";

type GeneticParametersPanelProps = {
  groups: GeneticSeries[];
  height?: number;
};

export function GeneticParametersPanel({
  groups,
  height = 260,
}: GeneticParametersPanelProps) {
  const [selectedValue, setSelectedValue] = useState(
    groups[0]?.geneticId ?? GENERAL_VALUE
  );

  if (groups.length === 0) return null;

  const selected =
    groups.find((group) => (group.geneticId ?? GENERAL_VALUE) === selectedValue) ??
    groups[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {groups.length > 1 && (
        <Select
          label="Genética"
          value={selected.geneticId ?? GENERAL_VALUE}
          onChange={setSelectedValue}
          options={groups.map((group) => ({
            value: group.geneticId ?? GENERAL_VALUE,
            label: group.label,
          }))}
        />
      )}
      <MeasurementChart series={selected.series} height={height} showStats />
    </div>
  );
}
