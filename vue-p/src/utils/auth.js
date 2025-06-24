export const setUserRole = (username) => {
  return username === 'admin' ? 'admin' : 'user'
}

export const getUserRole = () => {
  const role = localStorage.getItem('userRole');
  // 确保返回有效的字符串
  return role && typeof role === 'string' ? role : 'user';
}

export const isAdmin = () => {
  return getUserRole() === 'admin';
}