export type CultivationStatus = "active" | "finished";
export type PeriodType =
  | "germination"
  | "seedling"
  | "vegetative"
  | "flowering"
  | "drying"
  | "finished"
  | "custom";
export type ActionType =
  | "pruning"
  | "defoliation"
  | "transplant"
  | "training"
  | "solution_change"
  | "cleaning"
  | "other";
export type ProblemStatus = "active" | "resolved";

export type Profile = {
  id: string;
  name: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type Cultivation = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  plant_count: number;
  genetics: string | null;
  method: string | null;
  medium: string | null;
  environment: string | null;
  cover_image_url: string | null;
  final_notes: string | null;
  harvest_grams: number | null;
  final_grams: number | null;
  status: CultivationStatus;
  created_at: string;
  updated_at: string;
}

export type Plant = {
  id: string;
  cultivation_id: string;
  number: number;
  genetics: string | null;
  method: string | null;
  environment: string | null;
  medium: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export type CultivationPeriod = {
  id: string;
  cultivation_id: string;
  type: PeriodType;
  name: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

export type DailyEntry = {
  id: string;
  cultivation_id: string;
  entry_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type CultivationGenetic = {
  id: string;
  cultivation_id: string;
  name: string;
  name_key: string;
  created_at: string;
}

export type Measurement = {
  id: string;
  daily_entry_id: string;
  genetic_id: string | null;
  temperature: number | null;
  humidity: number | null;
  ph: number | null;
  ec: number | null;
  ppm: number | null;
  created_at: string;
  updated_at: string;
}

export type Irrigation = {
  id: string;
  daily_entry_id: string;
  performed_at: string;
  notes: string | null;
  created_at: string;
}

export type Action = {
  id: string;
  daily_entry_id: string;
  type: ActionType;
  title: string | null;
  notes: string | null;
  performed_at: string;
  created_at: string;
}

export type Photo = {
  id: string;
  daily_entry_id: string;
  storage_path: string;
  url: string | null;
  caption: string | null;
  created_at: string;
}

export type Problem = {
  id: string;
  cultivation_id: string;
  title: string;
  description: string | null;
  detected_at: string;
  status: ProblemStatus;
  solution: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ProblemPhoto = {
  id: string;
  problem_id: string;
  storage_path: string;
  url: string | null;
  created_at: string;
}

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type TableDef<
  Row,
  InsertRequired extends keyof Row,
  Rels extends Relationship[] = [],
> = {
  Row: Row;
  Insert: Pick<Row, InsertRequired> & Partial<Omit<Row, InsertRequired>>;
  Update: Partial<Row>;
  Relationships: Rels;
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<Profile, "id" | "name">;
      cultivations: TableDef<Cultivation, "user_id" | "name" | "start_date">;
      plants: TableDef<
        Plant,
        "cultivation_id" | "number",
        [
          {
            foreignKeyName: "plants_cultivation_id_fkey";
            columns: ["cultivation_id"];
            isOneToOne: false;
            referencedRelation: "cultivations";
            referencedColumns: ["id"];
          },
        ]
      >;
      cultivation_periods: TableDef<
        CultivationPeriod,
        "cultivation_id" | "type" | "name" | "start_date",
        [
          {
            foreignKeyName: "cultivation_periods_cultivation_id_fkey";
            columns: ["cultivation_id"];
            isOneToOne: false;
            referencedRelation: "cultivations";
            referencedColumns: ["id"];
          },
        ]
      >;
      daily_entries: TableDef<
        DailyEntry,
        "cultivation_id" | "entry_date",
        [
          {
            foreignKeyName: "daily_entries_cultivation_id_fkey";
            columns: ["cultivation_id"];
            isOneToOne: false;
            referencedRelation: "cultivations";
            referencedColumns: ["id"];
          },
        ]
      >;
      cultivation_genetics: TableDef<
        CultivationGenetic,
        "cultivation_id" | "name" | "name_key",
        [
          {
            foreignKeyName: "cultivation_genetics_cultivation_id_fkey";
            columns: ["cultivation_id"];
            isOneToOne: false;
            referencedRelation: "cultivations";
            referencedColumns: ["id"];
          },
        ]
      >;
      measurements: TableDef<
        Measurement,
        "daily_entry_id",
        [
          {
            foreignKeyName: "measurements_daily_entry_id_fkey";
            columns: ["daily_entry_id"];
            isOneToOne: false;
            referencedRelation: "daily_entries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "measurements_genetic_id_fkey";
            columns: ["genetic_id"];
            isOneToOne: false;
            referencedRelation: "cultivation_genetics";
            referencedColumns: ["id"];
          },
        ]
      >;
      irrigations: TableDef<
        Irrigation,
        "daily_entry_id",
        [
          {
            foreignKeyName: "irrigations_daily_entry_id_fkey";
            columns: ["daily_entry_id"];
            isOneToOne: false;
            referencedRelation: "daily_entries";
            referencedColumns: ["id"];
          },
        ]
      >;
      actions: TableDef<
        Action,
        "daily_entry_id" | "type",
        [
          {
            foreignKeyName: "actions_daily_entry_id_fkey";
            columns: ["daily_entry_id"];
            isOneToOne: false;
            referencedRelation: "daily_entries";
            referencedColumns: ["id"];
          },
        ]
      >;
      photos: TableDef<
        Photo,
        "daily_entry_id" | "storage_path",
        [
          {
            foreignKeyName: "photos_daily_entry_id_fkey";
            columns: ["daily_entry_id"];
            isOneToOne: false;
            referencedRelation: "daily_entries";
            referencedColumns: ["id"];
          },
        ]
      >;
      problems: TableDef<
        Problem,
        "cultivation_id" | "title" | "detected_at",
        [
          {
            foreignKeyName: "problems_cultivation_id_fkey";
            columns: ["cultivation_id"];
            isOneToOne: false;
            referencedRelation: "cultivations";
            referencedColumns: ["id"];
          },
        ]
      >;
      problem_photos: TableDef<
        ProblemPhoto,
        "problem_id" | "storage_path",
        [
          {
            foreignKeyName: "problem_photos_problem_id_fkey";
            columns: ["problem_id"];
            isOneToOne: false;
            referencedRelation: "problems";
            referencedColumns: ["id"];
          },
        ]
      >;
    };
    Views: Record<string, never>;
    Functions: {
      get_email_for_username: {
        Args: { p_username: string };
        Returns: string | null;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
