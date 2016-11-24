var _ = require('lodash');
var moment = require('moment');

/*
 * Data for the dojo
 */
var customers = require('./customer.json');

/*
The conditions for participation for customers are defined as follows:

1) The job status of the customer must be one of student, pupil or apprentice
2) The age must be 25 or less (the owner does not want to support long term students!)
3) For the data analysis, all purchases of the calendar year (in this case: 2015) 
   within the target group must be taken into consideration. The shop owner is interested in…
    a) the revenue aggregated by months (from January 2015 until December 2015)
    b) the total revenue throughout the entire year 2015
*/

var start = moment();

var WANTED_STATUS = ['student','pupil','apprentice'];
var LIMIT_AGE = 25;
var YEAR = 2015;

/***************************** Utility functions **************************/

/**
 * Has to check if the customer has the right age (25) and the righ status : student, pupil, apprentice
 */
var _isRightAgeAndStatus = (customer) => _.includes( WANTED_STATUS, customer.job) && customer.age<=LIMIT_AGE;
var _hasAnOrderInYear = (year, order) => order.date>=year+"-01-01" && order.date<=year+"-12-31";
var _filterEligibleOrders = (customer) => _.filter( customer.orders, ( order ) => _isRightAgeAndStatus( customer ) && _hasAnOrderInYear( YEAR, order ) );
var _atLeastOneOrder = (orders) => !_.isEmpty( orders );
var _addTheMonthNumber =  (orders) => _.map( orders, order => order.month = moment( order.date ).month() );
var _groupOrdersByMonth = (orders) => _.groupBy( orders, 'month' );
var _formatAmount = (amount) => parseFloat(amount).toFixed(2) +' €';
var _totalByMonth = (month) => _.reduce( month, function(total, value) { return total + value.total; }, 0.0);
var _formatMonthAndAmount = (month, total) => {
	var result = {};
	var label = moment().month(month).format("MMM");
	result[label] = _formatAmount(total);
	return result;
}
var _computeAmount = (orders) => {
	var totalAmount = 0.0;
	var totalByMonth = [];
	_.forEach( orders, function(month, key) {
		var total = _totalByMonth( month );
		totalByMonth.push( _formatMonthAndAmount(key, total) );
		totalAmount += total;
	});
	return {
		totalAmount: totalAmount,
		totalByMonth: totalByMonth
	};
}

/********************************* CORE ALGO *************************/

/**
 * Find eligible orders
 */
var eligibleOrders = _.reduce( customers, ( result, customer, key ) => {
    var orders = _filterEligibleOrders( customer );
    if( _atLeastOneOrder( orders ) ){
       return _.concat( result, orders );
    }
    return result;
}, []);

/**
 * Compute the month for each order
 */ 
_addTheMonthNumber(eligibleOrders);

/**
 * Group orders by month
 */
var eligibleOrdersByMonth = _groupOrdersByMonth(eligibleOrders);

/**
 * Compute the global amount and the amount per month
 */
var result = _computeAmount(eligibleOrdersByMonth);

/**
 * Display result
 */
console.log( JSON.stringify( result.totalByMonth, null, 4 ) );
console.log('Total: '+ _formatAmount(result.totalAmount) + ' (compute duration: '+ (moment()-start) +'ms)');