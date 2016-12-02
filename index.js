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
var _filterEligibleOrders = (customer) => _.filter( customer.orders, ( order ) => { if( moment(order.date).year() === YEAR) return order; } );
var eligibleOrders = _.reduce( customers, ( result, customer, key ) => {
    if( _.includes( WANTED_STATUS, customer.job) && customer.age<=LIMIT_AGE ){
        return _.concat( result, _filterEligibleOrders( customer ) );
    }
    return result;
}, []);

var result = _(eligibleOrders)
    .groupBy(order => moment(order.date).month())
    .mapValues(orderByMonth => _.sumBy(orderByMonth,'total'))
    .value();

console.log( JSON.stringify( result, null, 4 ) );
console.log('Total: '+ _.sum(_.valuesIn(result)) + ' (compute duration: '+ (moment()-start) +'ms)');