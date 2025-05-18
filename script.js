document.addEventListener("DOMContentLoaded", function(event) {
	//scroll causes Uncaught (in promise) NotAllowedError: play() failed because the user didn't interact with the document first
	document.onclick = (event) => {
		document.getElementById("anthem").play()
		document.onclick = null;
	};
	document.ontouchstart = (event) => {
		document.getElementById("anthem").play()
		document.ontouchstart = null;
	};

	const language = localStorage.getItem('language') ?? 'en';
	changeLanguage(language);

	fillNews();
});

function toggleMusic() {
	const anthem = document.getElementById("anthem")
	anthem.paused ? anthem.play() : anthem.pause()
}

function changeLanguage(language) {
	localStorage.setItem('language', language)

	const translatable = document.querySelectorAll('[data-t9n]')
	translatable.forEach((element) => {
		const id = element.getAttribute('data-t9n');
		const translation = translations[language][id]
		if (translation) {
			element.innerText = translation
		}
	});

	fillNews();
}

// <!-- News -->
function fillNews() {
	const carousel = document.querySelector('.carousel-track');
	carousel.innerHTML = '';
	const language = localStorage.getItem('language') ?? 'en';

	news.forEach((e) => {
		let div = document.createElement('div');
		div.id = e.date;
		div.classList.add('carousel-item');
		
		//TODO
		let text = document.createTextNode(e.title[language]);
		div.appendChild(text);
		carousel.appendChild(div)
	});
}
