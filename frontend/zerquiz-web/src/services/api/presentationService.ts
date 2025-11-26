import axios from 'axios';

const API_BASE = '/api/presentations';

export interface Presentation {
  id: string;
  title: string;
  description?: string;
  subjectId?: string;
  subjectName?: string;
  theme: string;
  allowStudentQuestions: boolean;
  showProgressBar: boolean;
  showSlideNumbers: boolean;
  isLive: boolean;
  liveCode?: string;
  liveStartTime?: string;
  slideCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Slide {
  id: string;
  presentationId: string;
  order: number;
  type: 'Title' | 'Content' | 'Image' | 'Quiz' | 'Poll' | 'TwoColumn';
  title?: string;
  content?: string;
  imageUrl?: string;
  imageCaption?: string;
  leftColumn?: string;
  rightColumn?: string;
  questionId?: string;
  pollQuestion?: string;
  pollOptions?: string;
  transition: string;
  duration: number;
  speakerNotes?: string;
  backgroundColor?: string;
  textColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePresentationRequest {
  title: string;
  description?: string;
  subjectId?: string;
  theme?: string;
  allowStudentQuestions?: boolean;
  showProgressBar?: boolean;
  showSlideNumbers?: boolean;
}

export interface CreateSlideRequest {
  presentationId: string;
  order: number;
  type: 'Title' | 'Content' | 'Image' | 'Quiz' | 'Poll' | 'TwoColumn';
  title?: string;
  content?: string;
  imageUrl?: string;
  imageCaption?: string;
  leftColumn?: string;
  rightColumn?: string;
  questionId?: string;
  pollQuestion?: string;
  pollOptions?: string;
  transition?: string;
  duration?: number;
  speakerNotes?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface UpdateSlideRequest {
  title?: string;
  content?: string;
  imageUrl?: string;
  imageCaption?: string;
  leftColumn?: string;
  rightColumn?: string;
  questionId?: string;
  pollQuestion?: string;
  pollOptions?: string;
  transition?: string;
  duration?: number;
  speakerNotes?: string;
  backgroundColor?: string;
  textColor?: string;
}

export const presentationService = {
  async getAll(): Promise<Presentation[]> {
    const response = await axios.get(API_BASE);
    return response.data.data || [];
  },

  async getById(id: string): Promise<Presentation> {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data.data;
  },

  async create(data: CreatePresentationRequest): Promise<Presentation> {
    const response = await axios.post(API_BASE, data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreatePresentationRequest>): Promise<Presentation> {
    const response = await axios.put(`${API_BASE}/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE}/${id}`);
  },

  async duplicate(id: string): Promise<Presentation> {
    const response = await axios.post(`${API_BASE}/${id}/duplicate`);
    return response.data.data;
  },

  async goLive(id: string): Promise<any> {
    const response = await axios.post(`${API_BASE}/${id}/go-live`);
    return response.data.data;
  },

  async endLive(id: string): Promise<void> {
    await axios.post(`${API_BASE}/${id}/end-live`);
  },

  // Slide operations
  async getSlides(presentationId: string): Promise<Slide[]> {
    const response = await axios.get(`${API_BASE}/${presentationId}/slides`);
    return response.data.data || [];
  },

  async getSlideById(presentationId: string, slideId: string): Promise<Slide> {
    const response = await axios.get(`${API_BASE}/${presentationId}/slides/${slideId}`);
    return response.data.data;
  },

  async createSlide(presentationId: string, data: CreateSlideRequest): Promise<Slide> {
    const response = await axios.post(`${API_BASE}/${presentationId}/slides`, data);
    return response.data.data;
  },

  async updateSlide(presentationId: string, slideId: string, data: UpdateSlideRequest): Promise<Slide> {
    const response = await axios.put(`${API_BASE}/${presentationId}/slides/${slideId}`, data);
    return response.data.data;
  },

  async deleteSlide(presentationId: string, slideId: string): Promise<void> {
    await axios.delete(`${API_BASE}/${presentationId}/slides/${slideId}`);
  },

  async reorderSlides(presentationId: string, slideIds: string[]): Promise<void> {
    await axios.post(`${API_BASE}/${presentationId}/slides/reorder`, slideIds);
  }
};
