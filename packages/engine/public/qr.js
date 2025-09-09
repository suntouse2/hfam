const wallet = document.getElementById('wallet').value

const copyButton = document.querySelector('.copy-button')

copyButton.addEventListener('click', () => {
	navigator.clipboard.writeText(wallet)
	copyButton.textContent = 'Скопировано!'
	setTimeout(() => {
		copyButton.textContent = 'Скопировать'
	}, 1000)
})

const qrCode = new QRCodeStyling({
	width: 220,
	height: 220,
	type: 'svg',
	data: wallet,
	image: '/static/icons/trc.png',

	dotsOptions: {
		gradient: {
			type: 'linear', // или "radial"
			rotation: -80, // угол поворота в радианах (0 = слева направо)
			colorStops: [
				{ offset: 0, color: '#26A17B' }, // начало
				{ offset: 1, color: '#43ddac' }, // конец
			],
		},
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
