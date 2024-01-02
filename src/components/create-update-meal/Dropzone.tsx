import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone'
import { FaCheck } from "react-icons/fa";
import { LuUtensilsCrossed } from "react-icons/lu";
import { IoMdCloudUpload } from "react-icons/io";
import { IoClose } from "react-icons/io5"
import classNames from 'classnames';

type DropzoneProps = {
	liftImageUp: (image: File | null) => void
	resetOnUpload: boolean
}

export const Dropzone: React.FC<DropzoneProps> = ({ liftImageUp, resetOnUpload }) => {
	const [preview, setPreview] = useState<string | null>(null)

	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (!acceptedFiles.length) {
			return
		}

		setPreview(URL.createObjectURL(acceptedFiles[0]))

		// lift image to parent component where upload will be handled
		liftImageUp(acceptedFiles[0])
	}, [liftImageUp])

	const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, } = useDropzone({
		accept: {
			"image/gif": [],
			"image/jpg": [],
			"image/jpeg": [],
			"image/png": [],
			"image/webp": [],
		},
		maxFiles: 1,
		maxSize: 4 * 1024 * 1024, // 4 mb
		onDrop: onDrop,
	})

	const dropzoneWrapperClasses = classNames({
		"drag-accept": isDragAccept,
		"drag-reject": isDragReject,
	})

	const handleRemovePreview = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation()

		setPreview(null)
		liftImageUp(null)
	}

	useEffect(() => {
		if (!preview) { return }

		// Make sure to revoke the data uris to avoid memory leaks, will run on unmount
		return () => URL.revokeObjectURL(preview)
	}, [preview])

	useEffect(() => {
		if (!resetOnUpload) { return }
		setPreview(null)
		liftImageUp(null)
	}, [liftImageUp, resetOnUpload])

	return (
		<div {...getRootProps()} id='dropzone' className={dropzoneWrapperClasses}>
			<input {...getInputProps()} />
			<p>Drag and drop a file here or click to browse.</p>

			<div className="text-3xl mb-2">
				{isDragActive
					? isDragAccept
						? <div><FaCheck size={40} color={'text-green-700'} /></div>
						: <div><LuUtensilsCrossed size={40} color={'text-red-700'} /></div>
					: <div><IoMdCloudUpload size={40} color={'text-green-700'} /></div>
				}
			</div>
			{preview &&
				<div className='relative max-w-[50%]'>
					<img
						alt='preview of uploaded image'
						src={preview}
						onLoad={() => { URL.revokeObjectURL(preview) }}
					/>
					<button
						title='remove preview'
						type='button'
						onClick={(e) => handleRemovePreview(e)}
						className='z-10 absolute flex items-center justify-center p-3 -top-4 -right-4 rounded-full text-light-background bg-gray-900'>
						<IoClose size={20} />
					</button>
				</div>
			}
		</div>
	);
}
