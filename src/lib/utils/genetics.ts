import type { Plant } from "@/types/database";

export function normalizeGeneticName(name: string): string {
  return name.trim().toLowerCase();
}

export type GeneticGroup = {
  key: string;
  name: string;
  plantCount: number;
};

export function getGeneticGroups(plants: Pick<Plant, "genetics">[]): {
  groups: GeneticGroup[];
  unassignedCount: number;
} {
  const groups: GeneticGroup[] = [];
  const byKey = new Map<string, GeneticGroup>();
  let unassignedCount = 0;

  for (const plant of plants) {
    const name = plant.genetics?.trim() ?? "";
    if (!name) {
      unassignedCount += 1;
      continue;
    }
    const key = normalizeGeneticName(name);
    const existing = byKey.get(key);
    if (existing) {
      existing.plantCount += 1;
    } else {
      const group = { key, name, plantCount: 1 };
      byKey.set(key, group);
      groups.push(group);
    }
  }

  return { groups, unassignedCount };
}
