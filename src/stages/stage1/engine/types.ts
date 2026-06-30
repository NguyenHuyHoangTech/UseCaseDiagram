export type InteractionType =
  | "SELECT_BLOCK_AND_RUN"
  | "SORT_BLOCKS"
  | "DRAG_TO_BOUNDARY"
  | "CONNECT_ACTOR_TO_USECASE"
  | "BUILD_USECASE_NAME"
  | "RUN_DIAGRAM_SCENARIO"
  | "INSIGHT";

export type FeedbackTone = "idle" | "success" | "error" | "mixed";
export type VisualEffect =
  | "shake"
  | "bounceBack"
  | "crack"
  | "stopAtNode"
  | "flowchartWarning"
  | "successPath"
  | "ticketSuccess"
  | "backendRoom"
  | "databaseRoom"
  | "outdatedTechnology"
  | "uiChanged"
  | "lockedSeat"
  | "wrongActor"
  | "renameMachine";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  steps: LessonStep[];
}

export type LessonStep =
  | SelectBlockStep
  | SortBlocksStep
  | DragToBoundaryStep
  | ConnectActorStep
  | BuildUseCaseNameStep
  | RunDiagramScenarioStep
  | InsightStep;

export interface LessonStepBase<T extends InteractionType, D> {
  id: string;
  title: string;
  story?: string;
  instruction?: string;
  type: T;
  data: D;
}

export interface BlockFeedback {
  simulation: string;
  feedback: string;
  visualEffect?: VisualEffect;
  visualPayload?: Record<string, unknown>;
}

export interface SelectBlock {
  id: string;
  label: string;
  icon?: string;
  feedback?: string;
  suggestion?: string;
  visualEffect?: VisualEffect;
}

export interface SelectBlockData {
  targetLabel?: string;
  blocks: SelectBlock[];
  correctId: string;
  feedbackByBlock: Record<string, BlockFeedback>;
  successSimulation?: string;
}

export type SelectBlockStep = LessonStepBase<"SELECT_BLOCK_AND_RUN", SelectBlockData>;

export interface SortZone {
  id: string;
  label: string;
}

export interface SortBlock {
  id: string;
  label: string;
  correctZoneId: string;
  feedback?: string;
  simulation?: string;
  visualEffect?: VisualEffect;
  successFeedback?: string;
}

export interface SortBlocksData {
  zones: SortZone[];
  blocks: SortBlock[];
  successSimulation: string;
  successVisualEffect?: VisualEffect;
  successDetails?: string[];
  mixedSimulation?: string;
  mixedVisualEffect?: VisualEffect;
}

export type SortBlocksStep = LessonStepBase<"SORT_BLOCKS", SortBlocksData>;

export interface BoundaryBlock {
  id: string;
  label: string;
  correctZoneId: "inside" | "outside" | "exclude";
  feedback?: string;
  simulation?: string;
  visualEffect?: VisualEffect;
  penalty?: string;
}

export interface DragToBoundaryData {
  boundaryLabel: string;
  zones: SortZone[];
  blocks: BoundaryBlock[];
  initialPlacements?: Record<string, string>;
  scenario?: string[];
  successSimulation: string;
  successVisualEffect?: VisualEffect;
}

export type DragToBoundaryStep = LessonStepBase<"DRAG_TO_BOUNDARY", DragToBoundaryData>;

export interface ActorNode {
  id: string;
  label: string;
  kind?: "human" | "system" | "time";
}

export interface UseCaseNode {
  id: string;
  label: string;
  icon?: string;
}

export interface Connection {
  actorId: string;
  useCaseId: string;
}

export interface ConnectActorData {
  actors: ActorNode[];
  useCases: UseCaseNode[];
  correctConnections: Connection[];
  feedbackByConnection?: Record<string, string | BlockFeedback>;
  successSimulation: string;
  successVisualEffect?: VisualEffect;
}

export type ConnectActorStep = LessonStepBase<"CONNECT_ACTOR_TO_USECASE", ConnectActorData>;

export interface BuildNameData {
  verbs: SelectBlock[];
  nouns: SelectBlock[];
  acceptedPairs: Connection[];
  requiredCount?: number;
  feedbackByPair?: Record<string, string>;
  successSimulation: string;
}

export type BuildUseCaseNameStep = LessonStepBase<"BUILD_USECASE_NAME", BuildNameData>;

export interface DiagramScenario {
  id: string;
  title: string;
  path: string[];
  requiredActors: string[];
  requiredUseCases: string[];
  requiredConnections: Connection[];
  feedback: string | BlockFeedback;
}

export interface RunDiagramScenarioData {
  mode?: "useCaseRunSimulation";
  systemLabel: string;
  goalText?: string;
  idleGoal?: string;
  passCondition?: string;
  actors: ActorNode[];
  useCases: UseCaseNode[];
  distractors?: SelectBlock[];
  journeySteps?: UseCaseNode[];
  correctConnections: Connection[];
  missingFeedback?: Record<string, { feedbackBody: string; suggestion: string }>;
  scenarios: DiagramScenario[];
  successSimulation: string;
  successVisualEffect?: VisualEffect;
}

export type RunDiagramScenarioStep = LessonStepBase<"RUN_DIAGRAM_SCENARIO", RunDiagramScenarioData>;

export interface InsightData {
  text: string;
  answers: string[];
  finalInsight: string;
  mantra?: string;
}

export type InsightStep = LessonStepBase<"INSIGHT", InsightData>;
