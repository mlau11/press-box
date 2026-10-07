export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      matches: {
        Row: {
          away_crest: string | null;
          away_score: number | null;
          away_short_name: string | null;
          away_team: string;
          created_at: string | null;
          home_crest: string | null;
          home_score: number | null;
          home_short_name: string | null;
          home_team: string;
          id: number;
          kickoff_at: string;
          league_code: string;
          matchday: number | null;
          status: string | null;
        };
        Insert: {
          away_crest?: string | null;
          away_score?: number | null;
          away_short_name?: string | null;
          away_team: string;
          created_at?: string | null;
          home_crest?: string | null;
          home_score?: number | null;
          home_short_name?: string | null;
          home_team: string;
          id: number;
          kickoff_at: string;
          league_code: string;
          matchday?: number | null;
          status?: string | null;
        };
        Update: {
          away_crest?: string | null;
          away_score?: number | null;
          away_short_name?: string | null;
          away_team?: string;
          created_at?: string | null;
          home_crest?: string | null;
          home_score?: number | null;
          home_short_name?: string | null;
          home_team?: string;
          id?: number;
          kickoff_at?: string;
          league_code?: string;
          matchday?: number | null;
          status?: string | null;
        };
        Relationships: [];
      };
      predictions: {
        Row: {
          created_at: string;
          id: string;
          is_scored: boolean;
          league_code: string;
          match_id: number;
          matchday: number | null;
          outcome: string | null;
          points_earned: number | null;
          predicted_away: number;
          predicted_home: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_scored?: boolean;
          league_code: string;
          match_id: number;
          matchday?: number | null;
          outcome?: string | null;
          points_earned?: number | null;
          predicted_away: number;
          predicted_home: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_scored?: boolean;
          league_code?: string;
          match_id?: number;
          matchday?: number | null;
          outcome?: string | null;
          points_earned?: number | null;
          predicted_away?: number;
          predicted_home?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "predictions_match_id_fkey";
            columns: ["match_id"];
            isOneToOne: false;
            referencedRelation: "matches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "predictions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string | null;
          email: string;
          id: string;
          scoring_window: number | null;
          username: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id: string;
          scoring_window?: number | null;
          username?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: string;
          scoring_window?: number | null;
          username?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_feed: {
        Args: { p_limit: number; p_offset: number };
        Returns: {
          away_crest: string;
          away_score: number;
          away_short_name: string;
          away_team: string;
          created_at: string;
          home_crest: string;
          home_score: number;
          home_short_name: string;
          home_team: string;
          is_scored: boolean;
          kickoff_at: string;
          league_code: string;
          match_id: number;
          matchday: number;
          outcome: string;
          points_earned: number;
          predicted_away: number;
          predicted_home: number;
          prediction_id: string;
          status: string;
          user_id: string;
          username: string;
        }[];
      };
      get_leaderboard: {
        Args: never;
        Returns: {
          accuracy_pct: number;
          avg_points_per_prediction: number;
          total_points: number;
          user_id: string;
          username: string;
        }[];
      };
      get_profile_stats: {
        Args: { p_user_id: string };
        Returns: {
          accuracy_pct: number;
          avg_points_per_prediction: number;
          scored_predictions: number;
          total_points: number;
          total_predictions: number;
        }[];
      };
      get_user_by_username: {
        Args: { p_username: string };
        Returns: {
          created_at: string | null;
          email: string;
          id: string;
          scoring_window: number | null;
          username: string | null;
        }[];
        SetofOptions: {
          from: "*";
          to: "users";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
