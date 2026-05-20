import { get, getPaginated, post, put, del } from '@/services/api/http'
import type { Product, ProductFilters, ProductFormData } from '@/types/product'

export const productsService = {
  list(filters?: ProductFilters) {
    return getPaginated<Product>('/products', filters as Record<string, unknown>)
  },

  getById(id: string) {
    return get<Product>(`/products/${id}`)
  },

  create(payload: ProductFormData) {
    return post<Product>('/products', payload)
  },

  update(id: string, payload: Partial<ProductFormData>) {
    return put<Product>(`/products/${id}`, payload)
  },

  remove(id: string) {
    return del(`/products/${id}`)
  },
}
