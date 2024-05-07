import User from '../../models/userModel.js'

//@desc Fetch User Details
//@route GET /api/v1/store/user/:userId
//@access public
export const fetchUserDetails = async (req, res) => {
  const userId = req.params.userId

  try {
    let query = { _id: userId }

    const store = await User.findOne(query)

    return res.status(200).json({
      success: true,
      message: 'User details fetched successfully.',
      store,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      errorType: 'ServerError',
      message: 'Server error',
      success: false,
    })
  }
}
