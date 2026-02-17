// Pylon API response types

export interface Account {
  id: string;
  name: string;
  domain?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Contact {
  id: string;
  email: string;
  name: string;
  account_id?: string;
  created_at: string;
}

export interface Issue {
  id: string;
  title: string;
  status: string;
  priority?: string;
  assignee_id?: string;
  account_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Team {
  id: string;
  name: string;
}

export interface Article {
  id: string;
  title: string;
  body?: string;
  collection_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
}

export interface CustomField {
  id: string;
  name: string;
  field_type: string;
}

export interface TicketForm {
  id: string;
  name: string;
}

export interface Survey {
  id: string;
  name: string;
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  score?: number;
  created_at: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor_id: string;
  created_at: string;
}

export interface ActivityType {
  id: string;
  name: string;
}

export interface MacroGroup {
  id: string;
  name: string;
}

export interface TrainingData {
  id: string;
  question: string;
  answer: string;
}

export interface UserRole {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  body: string;
  author_id?: string;
  created_at: string;
}

export interface Thread {
  id: string;
  subject?: string;
  created_at: string;
}

export interface Follower {
  id: string;
  user_id: string;
}
