import { FaCloudUploadAlt } from 'react-icons/fa'

const ImageUpload = ({
  images,
  register,
  handleImageChange,
  imageError,
  newImages = [],
}) => {
  return (
    <>
      <label
        className={`h-32 flex flex-col  gap-1 items-center justify-center border bg-gray-100 border-sAccent/30 rounded-2xl  p-2 text-2xl text-sAccent mb-2 ${
          images.length + newImages.length >= 4
            ? 'cursor-not-allowed'
            : 'cursor-pointer'
        }`}
      >
        <input
          type="file"
          multiple
          className="hidden"
          {...register('images')}
          onChange={handleImageChange}
          accept="image/*"
          disabled={images.length >= 4}
        />
        <FaCloudUploadAlt className="scale-150" />
        Upload
      </label>
      {imageError && (
        <span className="text-sm font-medium text-red-500 leading-1 italic mb-3">
          at least one image must be uploaded
        </span>
      )}
    </>
  )
}
export default ImageUpload
