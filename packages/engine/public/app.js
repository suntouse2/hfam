document.addEventListener('DOMContentLoaded', () => {
	const toggleBtn = document.getElementById('toggle-info')
	const wrapper = document.querySelector('.info-wrapper')
	const arrow = toggleBtn ? toggleBtn.querySelector('.arrow') : null
	const payForm = document.getElementById('pay-form')
	const main = document.querySelector('.main')
	if (toggleBtn && wrapper && arrow) {
		toggleBtn.addEventListener('click', () => {
			wrapper.classList.toggle('hidden')
			arrow.classList.toggle('right')
		})
	}

	payForm.addEventListener('submit', async e => {
		e.preventDefault()
		main.classList.add('loading')
		const formData = new FormData(payForm)
		const obj = Object.fromEntries(formData.entries())
		obj[e.submitter.name] = e.submitter.value

		const response = await fetch('/gateway/pay', {
			headers: { 'Content-Type': 'application/json' },
			method: 'POST',
			body: JSON.stringify(obj),
		})
		const data = await response.json()
		main.classList.remove('loading')

		if (data && data.paymentUrl) {
			const link = document.createElement('a')
			link.referrerPolicy = 'no-referrer'
			link.rel = 'noreferrer'
			link.href = data.paymentUrl
			link.click()
		} else {
			alert('Попробуйте еще раз!')
		}
	})
})
