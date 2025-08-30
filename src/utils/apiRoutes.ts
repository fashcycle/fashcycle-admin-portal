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
  productPermanentDelete: (id: string) => `/admin/products/${id}/permanent-delete`,
  userProducts: (userId: string) => `/admin/products/user/${userId}`,
  deletedProducts: '/admin/products/deleted',

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

  //pincode
  pincodeList: '/admin/pincode',
  pincodeDetail: (id: string) => `/admin/pincode/${id}`,
  pincodeCreate: '/admin/pincode/create',
  pincodeUpdate: (id: string) => `/admin/pincode/${id}`,
  pincodeDelete: (id: string) => `/admin/pincode/${id}`,

  //hero image
  heroImageList: '/admin/hero-image',
  heroImageDetail: (id: string) => `/admin/hero-image/${id}`,
  heroImageCreate: '/admin/hero-image',
  heroImageUpdate: (id: string) => `/admin/hero-image/${id}`,
  heroImageDelete: (id: string) => `/admin/hero-image/${id}`,

  //platform settings
  platformSettings: '/admin/platform-setting',
  platformSettingUpdate: (id: string) => `/admin/platform-setting/${id}`,

  //notifications
  notifications: '/admin/notifications',

  //payouts
  payoutList: '/admin/earnings',
  payoutDetail: (id: string) => `/admin/earning/${id}`,
  payoutUpdate: (id: string) => `/admin/earnings/${id}`,
  settlePayout: '/admin/payout/earning',
};

export default apiRoutes;
