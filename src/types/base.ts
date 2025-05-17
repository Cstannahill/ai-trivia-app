export interface Question {
  id: string;
  category: string;
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
  difficulty?: string;
  createdAt?: Date;

  // Add other properties as needed based on your API response
}
export type CharacterProfile = {
  name: string;
  type: string;
  traits: Record<string, string | boolean | string[]>;
  hints: string[];
  keywords?: string[];
};

export type SessionData = {
  profile: CharacterProfile | null;
  guesses: number;
  usedHints: number;
};
