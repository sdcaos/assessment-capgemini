export const findClients = (ApiService) => {
  return ApiService.getClients()
    .then((response) => response.data)
    .catch((err) => err)
}

export const findPolicies = (ApiService) => {
  return ApiService.getPolicies()
    .then((response) => response.data)
    .catch((err) => err)
}
