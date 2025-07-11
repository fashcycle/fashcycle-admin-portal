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
  productUpdate: (id: string) => `/admin/products/${id}/details`,
  productDelete: (id: string) => `/admin/products/${id}/delete`,
  productUpdateStatus: (id: string) => `/admin/products/${id}/status`,
  userProducts: (userId: string) => `/admin/products/user/${userId}`,

  //category
  allCategoryList: '/products/categories',
  categoryList: '/admin/categories',
  categoryDetail: (id: string) => `/admin/categories/${id}`,
  categoryCreate: '/admin/categories',
  categoryStatusUpdate: (id: string) => `/admin/categories/${id}/status`,
  categoryUpdate: (id: string) => `/admin/categories/${id}`,
  // categoryDelete: (id: string) => `/admin/categories/${id}`,

  //user
  userList: '/admin/users',
  userDetail: (id: string) => `/admin/user/${id}`,
  userCreate: '/admin/users',
  userUpdate: (userId: string) => `/admin/user/${userId}`,
  userDelete: (userId: string) => `/admin/user/${userId}`,
  userUpdateStatus: (userId: string) => `/admin/user/${userId}/status`,
  userSuspend: (userId: string) => `/admin/user/${userId}/suspend`,
  userSendMessage: (userId: string) => `/admin/user/${userId}/message`,

  //address
  userAddressAdd: (userId: string) => `/admin/user/${userId}/address`,
  addressUpdate: (addressId: string) => `/admin/address/${addressId}`,
  addressDelete: (addressId: string) => `/admin/address/${addressId}`,

  //orders
  orderList: '/admin/orders',
  orderDetail: (id: string) => `/admin/orders/${id}`,
  orderStatusUpdate: (id: string) => `/admin/orders/${id}/status`,
  userOrders: (userId: string) => `/admin/orders/user/${userId}`,

  //referral codes
  referralCodeList: '/admin/referral-codes',
  referralCodeDetail: (id: string) => `/admin/referral-codes/${id}`,
  referralCodeCreate: '/admin/referral-codes',
  referralCodeUpdate: (id: string) => `/admin/referral-codes/${id}`,
  referralCodeDelete: (id: string) => `/admin/referral-codes/${id}`,

};

export default apiRoutes;
