export interface QuestionPresentationType {
  id: string;
  code: string;
  name: string;
  description?: string;
  answerType: string; // text_input, options, boolean, matching, ordering, none
  minOptions?: number;
  maxOptions?: number;
  hideOptionLabelsInPreview: boolean;
  requiresAnswer: boolean;
  configSchema?: string;
  displayOrder: number;
}

