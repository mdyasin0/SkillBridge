export interface Challenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  timeLimit: number;
  description: string;
  requirements: string[];
  examples: {
    input: string;
    output: string;
  }[];
}