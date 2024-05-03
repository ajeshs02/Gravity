import Store from '../../models/storeModel.js'
import Follower from '../../models/followersModel.js'
import Product from '../../models/productModel.js'

//@desc Fetch  Stores based on Query Criteria
//@route GET /api/v1/user/stores
//@access public
export const fetchStores = async (req, res) => {
  const userId = req.user.id
  const isFollowing = req.query.isFollowing
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  // console.log('isFollowing', typeof isFollowing)

  try {
    let query = { isBlocked: false }

    if (isFollowing === 'true') {
      const followedStores = await Follower.find({ user: userId })
      const followedStoreIds = followedStores.map((follow) => follow.store)
      query = { _id: { $in: followedStoreIds } }
    }

    const totalStores = await Store.countDocuments(query)

    // Find stores
    const stores = await Store.find(query)
      .limit(limit)
      .skip((page - 1) * limit)

    // Fetch total followers count for each store
    const storesWithTotalFollowers = await Promise.all(
      stores.map(async (store) => {
        const followersCount = await Follower.countDocuments({
          store: store._id,
        })
        return { ...store.toObject(), totalFollowers: followersCount }
      })
    )

    return res.status(200).json({
      success: true,
      message: 'Stores fetched successfully.',
      stores: storesWithTotalFollowers,
      currentPage: page,
      totalPages: Math.ceil(totalStores / limit),
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

//@desc Fetch Store Details
//@route GET /api/v1/user/store/:storeId
//@access public
export const fetchStoreDetails = async (req, res) => {
  const storeId = req.params.storeId

  try {
    let query = { _id: storeId }

    const store = await Store.findOne(query)

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.',
      })
    }

    // Fetch only the user's _id when populating followers
    const followers = await Follower.find({ store: store._id }).populate(
      'user',
      '_id'
    )

    return res.status(200).json({
      success: true,
      message: 'Store details fetched successfully.',
      store: { ...store.toObject(), followers: followers },
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

//@desc Fetch Products from a Particular Store
//@route GET /api/v1/user/store/:storeId/products
//@access public
export const fetchStoreProducts = async (req, res) => {
  const storeId = req.params.storeId

  if (!storeId) {
    return res.status(400).json({
      success: false,
      message: 'Store ID is required to fetch products.',
    })
  }

  try {
    let query = { storeId, softDelete: false }

    const products = await Product.find(query)

    return res.status(200).json({
      success: true,
      message: 'Store products fetched successfully',
      products,
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

//@desc Follow/UnFollow a Store
//@route POST /api/v1/user/store/follow/:storeId
//@access private
export const followStore = async (req, res) => {
  const { storeId } = req.params
  const userId = req.user.id

  try {
    const existingFollower = await Follower.findOne({
      user: userId,
      store: storeId,
    })

    if (existingFollower) {
      // If the user is already following the store, remove the user from followers
      await Follower.deleteOne({ _id: existingFollower._id })
      return res.status(200).json({
        success: true,
        message: 'Store unfollowed successfully',
      })
    } else {
      // If the user is not already following the store, add the user to followers
      await Follower.create({ user: userId, store: storeId })
      return res.status(201).json({
        success: true,
        message: 'Store followed successfully',
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      errorType: 'ServerError',
      message: 'Error following/unfollowing store',
      success: false,
    })
  }
}
