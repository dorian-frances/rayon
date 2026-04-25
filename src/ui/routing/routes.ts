export const routes = {
  library: '/',
  recipeDetail: (id: string = ':id') => `/recipes/${id}`,
  recipeNew: '/recipes/new',
  recipeEdit: (id: string = ':id') => `/recipes/${id}/edit`,
  shopping: '/shopping',
  aisles: '/aisles',
} as const;
