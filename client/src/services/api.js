import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sf_token');
      localStorage.removeItem('sf_user');
      
      // Determine correct login redirect
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// ---- AUTH ----
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  me:       ()     => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ---- BOOKINGS ----
export const bookingsAPI = {
  getAvailability: (sport, date) => api.get(`/bookings/availability?sport=${sport}&date=${date}`),
  getMyBookings:   () => api.get('/bookings/my'),
  getAllBookings:   (params) => api.get('/bookings/all', { params }),
  create:          (data) => api.post('/bookings', data),
  confirm:         (id, paymentId) => api.put(`/bookings/${id}/confirm`, { paymentId }),
  cancel:          (id) => api.put(`/bookings/${id}/cancel`),
};

// ---- PAYMENTS ----
export const paymentsAPI = {
  createOrder:  (data) => api.post('/payments/create-order', data),
  verify:       (data) => api.post('/payments/verify', data),
  getHistory:   () => api.get('/payments/history'),
  getAll:       () => api.get('/payments/all'),
};

// ---- EVENTS ----
export const eventsAPI = {
  getAll:    (params) => api.get('/events', { params }),
  getById:   (id) => api.get(`/events/${id}`),
  create:    (data) => api.post('/events', data),
  update:    (id, data) => api.put(`/events/${id}`, data),
  delete:    (id) => api.delete(`/events/${id}`),
  enroll:    (id) => api.post(`/events/${id}/enroll`),
  uploadGallery: (id, formData) => api.post(`/events/${id}/gallery`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// ---- MEMBERSHIPS ----
export const membershipsAPI = {
  getPlans:   () => api.get('/memberships/plans'),
  getMy:      () => api.get('/memberships/my'),
  getAll:     () => api.get('/memberships/all'),
  purchase:   (data) => api.post('/memberships/purchase', data),
};

// ---- ATTENDANCE ----
export const attendanceAPI = {
  getMy:      (params) => api.get('/attendance/my', { params }),
  getStudent: (id) => api.get(`/attendance/student/${id}`),
  mark:       (data) => api.post('/attendance', data),
};

// ---- NOTIFICATIONS ----
export const notificationsAPI = {
  getMy:     () => api.get('/notifications/my'),
  markRead:  (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  send:      (data) => api.post('/notifications/send', data),
};

// ---- ADMIN ----
export const adminAPI = {
  getStats:      () => api.get('/admin/stats'),
  getUsers:      (params) => api.get('/admin/users', { params }),
  updateUser:    (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser:    (id) => api.delete(`/admin/users/${id}`),
  updateFeeStatus: (id, data) => api.put(`/admin/users/${id}/fee-status`, data),
};

// ---- SPORTS / PROGRAMS ----
export const sportsAPI = {
  getAll:  () => api.get('/sports'),
  create:  (data) => api.post('/sports', data),
  update:  (id, data) => api.put(`/sports/${id}`, data),
  delete:  (id) => api.delete(`/sports/${id}`),
};

// ---- BATCHES ----
export const batchesAPI = {
  getAll:        (params) => api.get('/batches', { params }),
  getById:       (id) => api.get(`/batches/${id}`),
  create:        (data) => api.post('/batches', data),
  update:        (id, data) => api.put(`/batches/${id}`, data),
  delete:        (id) => api.delete(`/batches/${id}`),
  addStudent:    (id, studentId) => api.post(`/batches/${id}/add-student`, { studentId }),
  removeStudent: (id, studentId) => api.delete(`/batches/${id}/remove-student/${studentId}`),
};

// ---- FEES & BILLING ----
export const feesAPI = {
  getAll:    (params) => api.get('/fees', { params }),
  getSummary: () => api.get('/fees/summary'),
  create:    (data) => api.post('/fees', data),
  update:    (id, data) => api.put(`/fees/${id}`, data),
  delete:    (id) => api.delete(`/fees/${id}`),
};

// ---- PERFORMANCE ----
export const performanceAPI = {
  getAll:  (params) => api.get('/performance', { params }),
  create:  (data) => api.post('/performance', data),
  update:  (id, data) => api.put(`/performance/${id}`, data),
  delete:  (id) => api.delete(`/performance/${id}`),
};

// ---- INVENTORY ----
export const inventoryAPI = {
  getAll:  (params) => api.get('/inventory', { params }),
  create:  (data) => api.post('/inventory', data),
  update:  (id, data) => api.put(`/inventory/${id}`, data),
  delete:  (id) => api.delete(`/inventory/${id}`),
};

// ---- REPORTS ----
export const reportsAPI = {
  getSummary: () => api.get('/reports/summary'),
  getFees:    (params) => api.get('/reports/fees', { params }),
  getStudents: () => api.get('/reports/students'),
  getBatches:  () => api.get('/reports/batches'),
};

// ---- SETTINGS ----
export const settingsAPI = {
  get:    () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

export default api;

