// <!-- Passport PDF Generator -->
const countryCode = "ELB";
const borderRadius = 5;

document.getElementById('img').addEventListener('change', (event) => {
	const file = document.getElementById('img').files[0];
	if (file) {
		document.getElementById('imgdisplay').src = window.URL.createObjectURL(file);
	}
});

//basically what i did: https://elliott-king.github.io/2020/09/callbacks_to_async/
function readFile(file) {
	return new Promise((resolve, reject) => {
		var reader = new FileReader();

		reader.onload = (e) => {
			const img = new Image();
			img.onload = function() {
				resolve({
					data: e.target.result,
					width: img.width,
					height: img.height
				});
			};
			reader.onerror = (e) => {
				reject(e);
			}
			img.src = e.target.result;
		};

		reader.onerror = (e) => {
			reject(e);
		}
	
		reader.readAsDataURL(file);
	});
}

function generateID(length) {
	let id = '';

	for (let i = 0; i < length; i++) {
		const num = Math.floor(Math.random() * 26) + 97;
		id += String.fromCharCode(num);
	}

	return id;
}

async function save() {
	const fname = document.getElementById('fname');
	const lname = document.getElementById('lname');
	const bdate = document.getElementById('bdate');
	const sex = document.getElementById('sex');
	const img = document.getElementById('img');

	const image = img.files[0] ? await readFile(img.files[0]) : null;	//Don't read image if nothing passed
	console.log(image);

	const unit = 'mm';
	//format: [125, 90]
	const format = [105, 75];

	var doc = new jspdf.jsPDF({
		unit: unit,
		format: format
	});

	console.log(generateID(8))

	//NOTE these should never change...
	var width = doc.internal.pageSize.getWidth();
	var height = doc.internal.pageSize.getHeight();

	function background(side, bison = true) {
		doc.setFillColor(255, 0, 0, 0);
		doc.roundedRect(0, 0, width, height, borderRadius, borderRadius, 'F');
		doc.rect( side === 'right' ? 0 : width / 2, 0, width / 2, height, 'F');
		//Middle white bar
		doc.setFillColor(0, 0, 0, 0);
		doc.rect(width / 3, 0, width / 3, height, 'F');

		//Orange bar
		doc.setFillColor('#EE9E23');
		doc.rect( side === 'right' ? 0 : 2 * width / 3, 0, width / 3, height, 'F');

		//Bison
		if (bison) {
			const bisonWidth = 15
			const bisonHeight = bisonWidth / dimensions(images.bison);
			const x = side === 'right' ? (5 * (width / 6)) - (bisonWidth / 2) : (width / 6) - (bisonWidth / 2);
			doc.addImage(images.bison.data, 'PNG', x, (width / 6) - (bisonWidth / 2), bisonWidth, bisonHeight);
		}
	}

	//Cover page
	background('right', false)
	
	const bioWidth = 10
	const bioHeight = bioWidth / dimensions(images.biometric);
	console.log (bioWidth, bioHeight)
	doc.addImage(images.biometric.data, 'PNG', width - 15, height - 10, bioWidth, bioHeight);
	
	const bisonWidth = 50
	const bisonHeight = bisonWidth / dimensions(images.bison);
	doc.addImage(images.bison.data, 'PNG', (width / 2) - (bisonWidth / 2), (height / 2) - (bisonHeight / 2), bisonWidth, bisonHeight);

	doc.setFontSize(8);
	doc.text('Elbonier Pass', width - 10, 10, {align: 'right'})
	doc.text('Passeport elbonien', width - 10, 15, {align: 'right'})
	doc.text('Passaporto elbonie', width - 10, 20, {align: 'right'})
	doc.text('Passaport elbon', width - 10, 25, {align: 'right'})
	doc.text('Elbonian passport', width - 10, 30, {align: 'right'})


	//Inner user page
	console.log('id page')
	doc.addPage({
		unit: unit,
		format: format
	})
	background('left', false)

	doc.setFillColor('#808080');
	doc.roundedRect(5, 5, width - 10, height - 10, 5, 5, 'F');

	doc.text('Elbonier Elbonien Elbonie Elbon Elbonian' , width - 10, 20, { angle: 90, rotationDirection: 0 })

	function getAllValuesForKey(stringID) {
		let str = '';
		for (const [key, value] of Object.entries(translations)) {
			str += `${value[stringID]} `
		}
		return str;
	}
	
	doc.setFontSize(4);
	const fieldY = height / 2;
	doc.text(getAllValuesForKey('fname'), width - 20, fieldY, { angle: 90, rotationDirection: 0 })
	doc.text(getAllValuesForKey('lname'), width - 30, fieldY, { angle: 90, rotationDirection: 0 })
	doc.text(getAllValuesForKey('bdate'), width - 40, fieldY, { angle: 90, rotationDirection: 0 })
	doc.text(getAllValuesForKey('sex'), width - 50, fieldY, { angle: 90, rotationDirection: 0 })

	const firstName = fname.value ? fname.value : 'FIRST NAME';
	const lastName = lname.value ? lname.value:  'LAST NAME';
	const sexValue = sex.value ? sex.value : 'SEX';
	const birthDate = bdate.value ? bdate.value : 'BIRTH DATE';
	doc.setFontSize(6);
	doc.text(firstName, width - 25, fieldY, { angle: 90, rotationDirection: 0 })
	doc.text(lastName, width - 35, fieldY, { angle: 90, rotationDirection: 0 })
	doc.text(birthDate, width - 45, fieldY, { angle: 90, rotationDirection: 0 })
	doc.text(sexValue, width - 55, fieldY, { angle: 90, rotationDirection: 0 })

	let currentDate = new Date()
	const currentDateString = currentDate.toISOString().split('T')[0]
	
	doc.setFillColor('#FFFFFF');
	doc.roundedRect(10, 10, width - 25, height / 3, 5, 5, 'F');
	// 1/3 is image
	if (image) {
		//I just... can't get this to work???
		//const imageWidth = 20;
		//const imageHeight = width * dimensions(image);
		//doc.addImage(image.data, 'PNG', (width / 2) - 10, (height / 4) -10, imageWidth, imageHeight, '', 'NONE', -90)
		//doc.addImage(image.data, 'PNG', (width / 2), (height / 4), imageWidth, imageHeight)
		doc.addImage(image.data, 'PNG', (width / 2) - 15, -10, 25, 25, '', 'NONE', -90)
	}

	//Middle - 52 pages I guess or whatever
	//TODO graphics...
	// first few & few last ones will have stuff
	// middle will just be graphics
	for (let i = 1; i <= 28; i++) {
		doc.addPage({
			unit: unit,
			format: format
		})

		background( i % 2 == 0 ? 'left' : 'right');

		doc.text(`-= ${i.toString()} =-`, width / 2, height - 5, {align: 'center'})
	}

	//last pages
	doc.addPage({
		unit: unit,
		format: format
	})
	background('right', false)
	
	doc.addPage({
		unit: unit,
		format: format
	})
	background('left', false)
	doc.addImage(images.bison.data, 'PNG', (width / 2) - (bisonWidth / 2), (height / 2) - (bisonHeight / 2), bisonWidth, bisonHeight);

	doc.save("passport.pdf");
}
