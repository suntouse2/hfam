document.addEventListener('DOMContentLoaded', () => {
	const wallet = document.getElementById('wallet').value

	const copyButton = document.querySelector('.copy-button')

	if (copyButton) {
		copyButton.addEventListener('click', () => {
			navigator.clipboard.writeText(wallet)
			copyButton.textContent = 'Скопировано!'
			setTimeout(() => {
				copyButton.textContent = 'Скопировать'
			}, 1000)
		})
	}

	const qrCode = new QRCodeStyling({
		width: 220,
		height: 220,
		type: 'svg',
		data: wallet,
		image: '/static/icons/trc.png',

		dotsOptions: {
			color: '#26A17B',
			type: 'rounded',
		},
		backgroundOptions: {
			color: '#fff',
		},
		imageOptions: {
			crossOrigin: 'anonymous',
			margin: 0,
		},
	})

	qrCode.append(document.getElementById('qr'))
})
