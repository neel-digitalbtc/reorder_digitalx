/* This script can be used to periodically reorder BTC from the 
   digitalX Direct API based on the level of a wallet balance. You 
   set the amount below which to order, the minimum time that must elapse
   between orders, and the maximum price you want to pay.
   Requires node-blockr https://www.npmjs.com/package/node-blockr

   by: Neel Krishnan
   contact: neel@digitalx.com
   date: 10-26-2015
*/


// get blockr object to parse wallet balance
var blockr = require('node-blockr');
var coin = new blockr('bitcoin');

// get config params
var config = require('./config.json');

// get digitalx object
var Digitalx = require('digitalx');
var digitalx = new Digitalx(config.key, config.secret);

// reorder based on wallet balance

// call blockr to get balance
coin.addressBalance(config.wallet, function(response) {

    console.log("Current Balance: " + response.data.balance);
    console.log("Ordering Threshold: " + config.threshold);    

    // execute if balance is below treshold param
    if (response.data.balance < config.threshold) {

	// check for time of last order to API
	digitalx.invoice(
	    function(err, res){

		var d = new Date();
		var since_last = (d.getTime()  - Date.parse(res.orders[res.orders.length-1].time)) / 1000 / 60;
		console.log("Minutes since last order: " + since_last);
		console.log("");

		if (since_last > config.minimum_order_spacing) {

		    console.log("Entered ordering area")
		    console.log("");

		    // execute order
		    digitalx.order(config.top_up_amount, config.max_price, 'buy',
				   function(err_order, res_order){
				       console.log(res_order);
				   });
		    
		};
	    });
    };
});


