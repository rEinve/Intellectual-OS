export type WorkspaceConfig = {
  label: string;
  description?: string;
  order?: number;
};

export const WORKSPACES: Record<string, WorkspaceConfig> = {
  "daily-notes": { label: "Daily Notes", description: "Design, field notes, experiments, outputs", order: 1 },
  "refference": { label: "refference", description: "Positioning, strategy, analysis", order: 2 },
  "philosophy": { label: "Philosophy", description: "Thinking frameworks", order: 3 },
  "systems": { label: "System", description: "Templates, operating rules, meta", order: 99 },
};
