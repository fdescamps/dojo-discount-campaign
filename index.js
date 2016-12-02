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

const isAnElligibleCustomer = customer => customer.age <= LIMIT_AGE && R.contains( customer.job, WANTED_STATUS );
let result = R.filter( isAnElligibleCustomer, customers );
result = R.map( customer => customer.orders , result );
result = R.flatten( result );
result = R.filter( order => moment(order.date).year() === YEAR, result );

let addMonth = R.map( order => { order.month = moment(order.date).month(); return order; }, result );
let sortByMonth = R.sortBy( R.prop( 'month' ) );
let ordersByMonth = R.groupWith( R.eqProps( 'month' ), sortByMonth( addMonth ) );
let plus = (acc, order) => acc+order.total; 
let sumByMonth = R.map( (orders) =>  R.reduce( plus, 0, orders ), ordersByMonth );

/**
 * Display result
 */
console.log( 'NB customers: ' + result.length );
console.log( 'Total: ' + JSON.stringify( sumByMonth, null, 4 ) );