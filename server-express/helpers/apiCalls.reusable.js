

export const findClients = (ApiService) => {

    return ApiService.getClients()
        .then(response => response.data)
        .catch(err => console.log(err))


}