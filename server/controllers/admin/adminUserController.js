import User from '../../models/userModel.js'

//@desc View all Users
//@route GET/api/v1/admin/users/view-users
//@access private
export const viewAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 8
  const searchQuery = req.query.search || ''

  try {
    const totalUsers = await User.countDocuments({
      role: 'user',
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { mobile: { $regex: searchQuery, $options: 'i' } },
      ],
    })

    const users = await User.find({
      role: 'user',
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { mobile: { $regex: searchQuery, $options: 'i' } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)

    res.status(200).json({
      message: 'Users fetched successfully',
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    })
  } catch (error) {
    handleError(error)
  }
}

//@desc Toggle User Block Status
//@route PUT /api/v1/admin/users/toggle-block/:userId
//@access private
export const toggleUserBlockStatus = async (req, res) => {
  const { userId } = req.params

  try {
    // Find the user by ID
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    // Toggle the isBlocked status to the opposite of its current value
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { isBlocked: !user.isBlocked } },
      { new: true }
    )

    res.status(200).json({
      success: true,
      message: 'User block status toggled successfully',
      user: {
        _id: updatedUser._id,
        isBlocked: updatedUser.isBlocked,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      error: 'Server error',
    })
  }
}
