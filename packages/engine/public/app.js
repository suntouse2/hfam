document.addEventListener('DOMContentLoaded', () => {
	const toggleBtn = document.getElementById('toggle-info')
	const wrapper = document.querySelector('.info-wrapper')
	const arrow = toggleBtn ? toggleBtn.querySelector('.arrow') : null

	if (toggleBtn && wrapper && arrow) {
		toggleBtn.addEventListener('click', () => {
			wrapper.classList.toggle('hidden')
			arrow.classList.toggle('right')
		})
	}

	document.querySelectorAll('.btn.method').forEach(btn => {
		btn.addEventListener('click', () => {
			const methodId = Number(btn.dataset.id)

			// Берём текущий URL
			const url = new URL(window.location.href)

			// Меняем путь: было /gateway/10 → станет /gateway/10/pay
			url.pathname = url.pathname.replace(/\/gateway\/(\d+)$/, '/gateway/$1/pay')

			// Добавляем methodId в query
			url.searchParams.set('methodId', methodId)

			// Делаем редирект
			window.location.href = url.toString()
		})
	})
})
