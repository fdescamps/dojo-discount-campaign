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
/*
var orders = _(customers)
    .filter(customer => customer.age <= LIMIT_AGE && _(WANTED_STATUS).contains(customer.job))
    .map(customer => customer.orders)
    .flatten()
    .filter(order => moment(order.date).year() === YEAR)
    .value();
     
var result = _(orders)
    .groupBy(order => moment(order.date).month())
    .mapValues(orderByMonth => _.sumBy(orderByMonth,'total'))
    .value();     
        
var result = _(orders)
    .groupBy( order => moment(order.date).month())
    .map( month => _(month).sum('total') )
    .value();*/

const isAnElligibleCustomer = customer => customer.age <= LIMIT_AGE && R.contains( customer.job, WANTED_STATUS );
let result = R.filter( isAnElligibleCustomer, customers );
result = R.map( customer => customer.orders , result );
result = R.flatten( result );
result = R.filter( order => moment(order.date).year() === YEAR, result );

/*
var numbers = [1, 2, 3];
var plus = (a, b) => a + b;
R.reduce(plus, 10, numbers); //=> 16
*/

//let ordersByMonth = R.groupBy( order => moment(order.date).month() );
//let byMonth = R.reduce( , 0.0, ordersByMonth); R.map( month => _(month).sum('total'), byGrade );
//let byMonth = R.compose( R.key, R.map )( ordersByMonth )

let addMonth = R.map( order => { order.month = moment(order.date).month(); return order; }, result );
let sortByMonth = R.sortBy( R.prop( 'month' ) );
//console.log( 'sortByMonth: ' + JSON.stringify( sortByMonth( addMonth, null, 4 ) ) );
let ordersByMonth = R.groupWith( R.eqProps( 'month' ), sortByMonth( addMonth ) );
console.log( 'ordersByMonth: ' + JSON.stringify( ordersByMonth, null, 4 ) );




let plus = (o1, o2) => { 
        console.log('====> '+JSON.stringify(o1)+','+JSON.stringify(o1)); 
        return o1.total+o2.total; 
    };
let sumByMonth = R.map( 
    (orders) => { 
        console.log('======> '+JSON.stringify(orders,null,4)); 
        return R.reduce( plus, 0.0, orders );
    }, 
    ordersByMonth);
    
console.log( 'sumByMonth: ' + JSON.stringify( sumByMonth, null, 4 ) );



/**
 * Display result
 */
console.log( 'NB customers: ' + result.length );
console.log( 'Total: ' + JSON.stringify( sumByMonth, null, 4 ) );
//console.log('Total: '+ R.sum(R.valuesIn(result)) + ' (compute duration: '+ (moment()-start) +'ms)');
//console.log( 'Total: ' + _(result).sum() + ' (compute duration: '+ (moment()-start) +'ms) ')

/*
var numbers = [1, 2, 3];
var plus = (a, b) => a + b;

R.reduce(plus, 10, numbers); //=> 16



R.groupWith(R.equals, [0, 1, 1, 2, 3, 5, 8, 13, 21])
//=> [[0], [1, 1], [2], [3], [5], [8], [13], [21]]

R.groupWith((a, b) => a % 2 === b % 2, [0, 1, 1, 2, 3, 5, 8, 13, 21])
//=> [[0], [1, 1], [2], [3, 5], [8], [13, 21]]

R.groupWith(R.eqBy(isVowel), 'aestiou')
//=> ['ae', 'st', 'iou']



var f = R.compose(R.inc, R.negate, Math.pow);

f(3, 4); // -(3^4) + 1




var reduceToNamesBy = R.reduceBy((acc, student) => acc.concat(student.name), []);
var namesByGrade = reduceToNamesBy(function(student) {
  var score = student.score;
  return score < 65 ? 'F' :
         score < 70 ? 'D' :
         score < 80 ? 'C' :
         score < 90 ? 'B' : 'A';
});
var students = [{name: 'Lucy', score: 92},
                {name: 'Drew', score: 85},
                // ...
                {name: 'Bart', score: 62}];
namesByGrade(students);
// {
//   'A': ['Lucy'],
//   'B': ['Drew']
//   // ...,
//   'F': ['Bart']
// }

*/