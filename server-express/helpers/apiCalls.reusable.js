

export const findClients = async (ApiService, headers) => {

  try {

    const clients = await ApiService.getClients(headers)

    return clients.length ? clients : null

  } catch (error) {

    throw error

  }

}

export const findPolicies = (ApiService) => {
  return ApiService.getPolicies()
    .then((response) => response.data)
    .catch((err) => err)
}
