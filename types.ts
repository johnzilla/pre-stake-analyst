export interface KeywordOpportunity {
  id: string;
  keyword: string;
  searchVolume: number;
  cpc: number;
  keywordDifficulty: number; // 0-100
  currentPreStaked: number;
  isAvailable: boolean;
  opportunityScore: number; // 0-100
  topStaker?: string;
  category?: string;
}

export enum AnalysisSource {
  AI_GENERATED = 'AI_GENERATED',
  CSV_IMPORT = 'CSV_IMPORT'
}

export interface ChartDataPoint {
  x: number; // Difficulty
  y: number; // Volume
  z: number; // CPC (size)
  name: string;
  score: number;
}
