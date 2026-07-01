export interface Service {
  id: number
  title: string
  description: string
  content?: string
  icon?: string
  coverImage?: string
  price?: string
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface Case {
  id: number
  title: string
  description: string
  content?: string
  coverImage?: string
  clientName?: string
  location?: string
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

export interface Article {
  id: number
  title: string
  summary?: string
  content: string
  coverImage?: string
  category: string
  status: string
  viewCount: number
  publishedAt?: string
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    name: string
    avatar?: string
  }
}

export interface Product {
  id: number
  name: string
  description?: string
  content?: string
  coverImage?: string
  price: number | null
  categoryId: number
  category?: ProductCategory
  createdAt: string
  updatedAt: string
}

export interface ProductCategory {
  id: number
  name: string
  sortOrder: number
}

export interface Certificate {
  id: number
  title: string
  image: string
  sortOrder: number
}

export interface ContactInfo {
  companyName: string
  address: string
  phone1: string
  phone2: string
  email1: string
  email2: string
  workHours1: string
  workHours2: string
}

export interface SiteSetting {
  siteName: string
  siteSlogan: string
  siteLogo: string
  siteIcon: string
}

export interface Message {
  name: string
  phone: string
  email?: string
  company?: string
  subject?: string
  content: string
}

export interface PaginatedResponse<T> {
  list: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
}
