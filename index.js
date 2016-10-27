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

var result = {};

/**
 * Display result
 */
console.log( JSON.stringify( result.totalByMonth, null, 4 ) );
console.log('Total: '+ result.totalAmount + ' (compute duration: '+ (moment()-start) +'ms)');