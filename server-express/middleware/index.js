import helpObj from '../helpers/functions.helpers.js'

const middleware = {
  isClientUser: async (token, ApiCall) => {

    const currentUserData = await helpObj.findCurrentUserDetails(token, ApiCall)

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
