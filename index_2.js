const R = require('ramda');
const moment = require('moment');

/*
 * Data for the dojo
 */
const data = require('./customer.json');

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

/** Put orders at a higher level and set for each other data (age,job) */
const flattenOrders = 
    R.flatten( 
        R.map( customer => 
            R.map( 
                order => { order.age = customer.age; order.job = customer.job; return order; }, 
                customer.orders 
            ), 
            data 
        )
    );

/** Utils Method */
const reduce = (xs, x) => { xs.push(x); return xs; }
const mapping = (f) => (reducing) => (result, input) => reducing( result, f(input) );
const filtering = (predicate) => (reducing) => (result, input) => predicate(input) ? reducing(result, input) : result;

const transduceCustomersInOrders = R.compose(
    filtering( order => order.age <= LIMIT_AGE && R.contains( order.job, WANTED_STATUS ) && moment(order.date).year() === YEAR ),
    mapping( order => { order.month = moment(order.date).month(); return order; } )
);
const orders = flattenOrders.reduce( transduceCustomersInOrders( reduce ), []);

const computeRevenus = R.pipe(
    R.sortBy( R.prop( 'month' ) ),
    R.groupWith( R.eqProps( 'month' ) ),
    R.map( (orders) =>  R.reduce( (acc, order) => acc+order.total, 0, orders ) )
);
let sumByMonth = computeRevenus( orders );

/**
 * Display result
 */
console.log( 'NB orders to analyze:',orders.length );
console.log( 'Total by month:', JSON.stringify( sumByMonth, null, 4 ) );
console.log( '(compute duration:', (moment()-start) +'ms)');