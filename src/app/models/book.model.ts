export interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  description: string;
  genre: string[];
  rating: number;
  available: boolean;
  date: Date;
}

export interface Loan {
  id: number;
  book: Book;
  dueDate: Date;
  daysLeft: number;
  isLate: boolean;
}

export interface Review {
  id: number;
  title: string;
  body: string;
  reviewerName: string;
  date: Date;
  rating: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  date: Date;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate: Date;
  password: string; //TODO - link with BDD security
  role: number; //TODO - link with token connexion to access diff. dashboards
}
