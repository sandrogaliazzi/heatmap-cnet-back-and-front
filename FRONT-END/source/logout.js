export function logout() {
  sessionStorage.clear();
  location.href = "/";
}