const apiRoutes = {
  login: '/auth/login', //done 
  changePassword: '/auth/change-password',
  forgotPassword: '/auth/forgot-password',
  profile: '/profile',
  updateProfile: '/profile/update',
  logout: '/auth/logout',

  //dashboard
  dashboard: '/dashboard',

  //products
  productList: '/admin/products',
  productDetail: (id: string) => `/admin/products/${id}`,
  productCreate: '/admin/products/create',
  productUpdate: (id: string) => `/admin/products/${id}/update`,
  productDelete: (id: string) => `/admin/products/${id}/delete`
};

export default apiRoutes;
