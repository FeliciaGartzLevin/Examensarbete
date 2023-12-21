import { Circles } from 'react-loader-spinner'

export const LoadingSpinner = () => (
	<div className='absolute w-screen h-screen bg-dark-background flex justify-center'>
		<div className='mt-[30%]'>
			<Circles
				height="120"
				width="120"
				color="#4fa94d"
				ariaLabel="circles-loading"
				wrapperStyle={{}}
				wrapperClass=""
				visible={true}
			/>
		</div>
	</div>
)


