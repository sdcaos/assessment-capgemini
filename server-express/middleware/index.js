import helpObj from '../helpers/functions.helpers.js'

const middleware = {
  isClientUser: async (token, ApiCall) => {
    const currentUserData = await helpObj
      .findCurrentUserDetails(token, ApiCall)
      .then((currentUser) => currentUser)
      .catch((err) => err)

    // if the user role is simple user return just hes own userdata
    if (currentUserData?.role === 'user') return currentUserData

    return false
  },

  isUserPolicies: async (token, ApiCall, limit) => {
    const currentUser = await helpObj
      .findCurrentUserDetails(token, ApiCall)
      .then((response) => response)
      .catch((err) => err)

    if (currentUser?.role === 'user') return helpObj.findUserPolicies(currentUser, ApiCall, limit)

    return false
  },
}

export default middleware
