const moment = require("moment");
const fetch = require('node-fetch')

var express = require('express');
var router = express.Router();

const DAYS_AHEAD = 15;

router.get('/padel', async function(req, res, next) {
	
	let response = await padelNextDays(DAYS_AHEAD);

	response.sort(function(a, b) {
		return a.date > b.date;
	});

	console.log(response);

	res.send(response);
});

async function padelNextDays(numberOfDaysAhead) {

	let response = [];

	for(let i=1; i<=numberOfDaysAhead; i++) {
		
		let day = moment(new Date()).add(i, "days");
		let isWorkingDay = day.isoWeekday() < 6;
		
		let timeArray = isWorkingDay ? ['20:00'] : ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

		for(let time of timeArray) {
			
			let url = `https://www.prenotauncampo.it/default/search/getresults/?location=Modena, MO, Italia&lat=44.647128&lon=10.9252269&city=Modena&sport=17&form-date=${day.format("YYYY-MM-DD")}&date=${day.format("YYYY-MM-DD")} ${time}&sort=popularity&radius=10&fuzzy=on`;
				
			let fetchResponse = JSON.stringify(await (await fetch(url, { timeout = 120000 })).json());

			fetchResponse = handleResponse(day, time, day.format("dddd"), fetchResponse);
			
			if(fetchResponse) {
				// console.log("fetchResponse after", fetchResponse);
				response.push(...fetchResponse);
			}
		}
	}

	return response;
}

function handleResponse(day, time, dayType, fetchResponse) {
	
	let json = JSON.parse(fetchResponse, null, 2);
	
	if(!json.solutionsCount) {
		return;
	}
	
	let response = [];
	
	for(let item of json.list) {
		
		let facility = item.facility;
		
		for(let field of item.fields) {
	
			// response.push(facility.name + " " + facility.address
			// 	+ " | " + field.field.solutions[0].date
			// 	+ " -- " + field.field.duration / 60 + ' hours'
			// 	+ " (" + field.field.solutions[0].cost + ' €)');

			response.push({
				name: facility.name,
				address: facility.address,
				date: field.field.solutions[0].date,
				weekday: day.format('dddd'),
				duration: field.field.duration / 60 + ' hours',
				cost: field.field.solutions[0].cost + ' €'
			})
		}
	}

	return response;
}

module.exports = router;
