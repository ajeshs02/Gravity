import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import Rating from '@mui/material/Rating'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addReview } from '../../api/user'

const ReviewModal = ({ productId, setReviewModal, productRefetch }) => {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')

  const queryClient = useQueryClient()

  const { mutateAsync: addReviewMutation, isPending } = useMutation({
    mutationFn: (data) => addReview({ ...data, productId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews'])
      productRefetch()
    },
  })

  return (
    <div
      className="fixed z-50 top-0 right-0 left-0 bottom-0 flex flex-center"
      style={{ background: 'rgba(0,0,0,0.8)' }}
    >
      <div className="absolute right-10 top-5" onClick={() => setReviewModal()}>
        <img src="../../../assets/icons/modal-close.png" alt="" />
      </div>
      <div className=" w-11/12 sm:w-8/12 md:w-7/12 lg:w-5/12h-fit  p-5 flex flex-col bg-primary rounded-xl">
        <div>
          <h1 className="text-xl mb-3 font-medium">Add review</h1>
        </div>
        <div className="my-2">
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue)
            }}
          />
        </div>

        <div>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="resize-y"
            placeholder="Add your review..."
            rows={5}
          />
        </div>

        <button
          className="w-full mt-5 py-2 bg-uAccent text-white text-lg rounded-xl active:scale-[0.99] hover:shadow-lg font-semibold"
          disabled={review.length === 0 || isPending}
          onClick={async () => {
            try {
              await addReviewMutation({ rating, review })
              setReviewModal()
            } catch (error) {
              console.error(error)
            }
          }}
        >
          {isPending ? 'Submitting...' : 'Add Review'}
        </button>
      </div>
    </div>
  )
}
export default ReviewModal
