import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { deleteProduct } from '../../api/store'

const DeleteModal = ({ id, name, setDeleteModal, softDelete }) => {
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const { mutateAsync: deleteProductMutation, isPending } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries([
        'storeProducts',
        'product',
        'deletedProducts',
        id,
      ])
      setDeleteModal(false)
    },
  })

  const handleToggleDelete = async () => {
    try {
      await deleteProductMutation(id)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div
      className="fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center z-30"
      style={{ background: 'rgba(0,0,0,0.8)' }}
    >
      <div className="w-2/5 max-sm:w-4/5 h-44 r p-5 flex flex-col bg-slate-50 rounded-md">
        <div className="h-3/4 text-start flex justify-start items-center">
          {softDelete ? (
            <p className="text-lg flex font-medium">recycle "{name}"?</p>
          ) : (
            <p className="text-lg flex font-medium">
              Are you sure you want to delete "{name}"
            </p>
          )}
        </div>
        <div className="h-1/4 flex gap-x-2 w-full ">
          <button
            className={`border ${
              softDelete ? 'border-green-600' : 'border-red-600'
            } w-2/4 ${
              softDelete ? 'bg-green-100' : 'bg-red-100'
            } flex items-center justify-center py-3 rounded ${
              softDelete ? 'hover:bg-green-600' : 'hover:bg-red-600'
            } hover:text-white font-semibold hover:shadow transition-all `}
            onClick={handleToggleDelete}
          >
            {softDelete ? 'recycle' : isPending ? 'Deleting...' : 'Delete'}
          </button>
          <button
            className="border border-blue-600 bg-blue-100 flex items-center justify-center w-2/4 py-3 rounded hover:bg-blue-600 hover:text-white font-semibold hover:shadow transition-all "
            onClick={() => setDeleteModal(false)}
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  )
}
export default DeleteModal
