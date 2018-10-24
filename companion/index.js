import * as messaging from "messaging";
import {
	settingsStorage
} from "settings";
import {
	me
} from "companion"

//messaging.peerSocket.send(JSON.stringify('data'));

messaging.peerSocket.addEventListener("message", (evt) => {
	//to get user_id from fitbit account, login in settings from mobile device 
	let user_id = settingsStorage.getItem('user_id');
	evt.data.user_id = user_id
  
  // Device send check event every 30 min
	if (evt.data.eventName == 'check') {
		let url = `http://104.248.132.164:7070/check`
		fetch(url, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(evt.data)
			})
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				if (data.data == true) {
          			// Send data to the watch as a JSON string and make device virate
					messaging.peerSocket.send(JSON.stringify(data)); 
				}
			})
			.catch(function (error) {
				console.log(error);
			}); // Log any errors with Fetch
  	// Response handler
	} else if (evt.data) {
		let url = `http://104.248.132.164:7070`
		fetch(url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(evt.data)
		});
	} else {
		console.log("Error! Can not send request to server.")
	}
});