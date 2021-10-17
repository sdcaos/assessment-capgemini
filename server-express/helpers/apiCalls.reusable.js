const findClients = (ApiService) => {
  return ApiService.getClients()
    .then((response) => response.data)
    .catch((err) => err)
}

export default findClients
