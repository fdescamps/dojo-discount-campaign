const R = require('ramda');
const moment = require('moment');

/*
 * Data for the dojo
 */
const customers = require('./customer.json');

/*
The conditions for participation for customers are defined as follows:

1) The job status of the customer must be one of student, pupil or apprentice
2) The age must be 25 or less (the owner does not want to support long term students!)
3) For the data analysis, all purchases of the calendar year (in this case: 2015) 
   within the target group must be taken into consideration. The shop owner is interested in…
    a) the revenue aggregated by months (from January 2015 until December 2015)
    b) the total revenue throughout the entire year 2015
*/

const start = moment();

const WANTED_STATUS = ['student','pupil','apprentice'];
const LIMIT_AGE = 25;
const YEAR = 2015;

let filterCustomers = R.pipe( 
    R.filter( customer => customer.age <= LIMIT_AGE && R.contains( customer.job, WANTED_STATUS ) ), 
    R.map( customer => customer.orders ), 
    R.flatten, 
    R.filter( order => moment(order.date).year() === YEAR ) 
);
let result = filterCustomers( customers );

let computeRevenus = R.pipe(
    R.map( order => { order.month = moment(order.date).month(); return order; } ),
    R.sortBy( R.prop( 'month' ) ),
    R.groupWith( R.eqProps( 'month' ) ),
    R.map( (orders) =>  R.reduce( (acc, order) => acc+order.total, 0, orders ) )
);
let sumByMonth = computeRevenus( result );

/**
 * Display result
 */
console.log( 'NB customers: ' + result.length );
console.log( 'Total: ' + JSON.stringify( sumByMonth, null, 4 ) );