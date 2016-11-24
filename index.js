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

/**
 * Find eligible orders
 */
var _isRightAgeAndStatus = (customer) => _.includes( WANTED_STATUS, customer.job) && customer.age<=LIMIT_AGE;
var _hasAnOrderInYear = (year, order) => order.date>=year+"-01-01" && order.date<=year+"-12-31";
var _filterEligibleOrders = (customer) => _.filter( customer.orders, ( order ) => _isRightAgeAndStatus( customer ) && _hasAnOrderInYear( YEAR, order ) );
var _atLeastOneOrder = (orders) => !_.isEmpty( orders );
var result = _.reduce( customers, ( result, customer, key ) => {
    var orders = _filterEligibleOrders( customer );
    if( _atLeastOneOrder( orders ) ){
       return _.concat( result, orders );
    }
    return result;
}, []);

/**
 * Display result
 */
console.log( JSON.stringify( result, null, 4 ) );