// 1. Initialize Firebase
var config = {
  apiKey: 'AIzaSyAax-ZCoSCfaIlWMVHQ_pwFhRLRVdom2nI',
  authDomain: 'train-scheduler-6cdf0.firebaseapp.com',
  databaseURL: 'https://train-scheduler-6cdf0.firebaseio.com',
  projectId: 'train-scheduler-6cdf0',
  storageBucket: 'train-scheduler-6cdf0.appspot.com',
  messagingSenderId: '827840644501'
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$('#add-train-btn').on('click', function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $('#train-name-input')
    .val()
    .trim();
  var cityDestination = $('#city-destination-input')
    .val()
    .trim();
  var firstTrainTime = $('#first-train-time-input')
    .val()
    .trim();
  var frequencyMin = $('#frequency-min-input')
    .val()
    .trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    trainName: trainName,
    city: cityDestination,
    firstTrain: firstTrainTime,
    frequency: frequencyMin
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  database.ref().on('child_added', function(childSnapshot) {
    var trainName = childSnapshot.val().trainName;
    var cityName = childSnapshot.val().city;
    var firstTrain = childSnapshot.val().firstTrain;
    var frequency = childSnapshot.val().frequency;

    // Clears all of the text-boxes
    $('#train-name-input').val('');
    $('#city-destination-input').val('');
    $('#first-train-time-input').val('');
    $('#frequency-min-input').val('');
    var firstTrainTimeVariable = moment
      .duration(childSnapshot.val().firstTrain)
      .asMinutes();
    console.log('Looking for this: ', firstTrainTimeVariable);

    // current time in hh:mm format
    var timeNow = moment().format('HH:mm');
    // current time in minutes
    var currentMin = moment.duration(timeNow).asMinutes();
    // number of minutes passed from first train time till current time
    var numMin = moment.duration(timeNow).asMinutes() - firstTrainTimeVariable;
    // frequency of train time
    var freq = childSnapshot.val().frequency;
    // time remaining till next train
    var remaining = numMin % freq;
    // minutes away from next train
    var minAway = freq - remaining;
    // next train arrival in minutes
    var answer = currentMin + minAway;
    // function to convert next train arrival minutes to hh:mm a
    function getTimeFromMin(mins) {
      if (mins >= 24 * 60 || mins < 0) {
      }
      var h = (mins / 60) | 0;
      var m = mins % 60 | 0;

      return moment
        .utc()
        .hours(h)
        .minutes(m)
        .format('hh:mm A');
    }

    var arrivalTime = getTimeFromMin(answer);

    var newRow = $('<tr>').append(
      $('<td>').text(trainName),
      $('<td>').text(cityName),
      $('<td>').text(frequency),
      $('<td>').text(arrivalTime),
      $('<td>').text(minAway)
    );

    //   // // Append the new row to the table
    $('#train-table > tbody').append(newRow);
  });

  //   var trainName = childSnapshot;
  // Logs everything to console
  console.log(newTrain.trainName);
  console.log(newTrain.city);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);
  // console.log(newTrain.dateAdded);

  //   var newRow = $('<tr>').append(
  //     $('<td>').text(trainName),
  //     $('<td>').text(cityDestination),
  //     $('<td>').text(frequencyMin)
  //     // $('<td>').text(arrivalTime),
  //     // $('<td>').text(minAway)
  //   );

  //   //   // // Append the new row to the table
  //   $('#train-table > tbody').append(newRow);

  //   // Clears all of the text-boxes
  //   $('#train-name-input').val('');
  //   $('#city-destination-input').val('');
  //   $('#first-train-time-input').val('');
  //   $('#frequency-min-input').val('');
});

// // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
// database.ref().on('child_added', function(childSnapshot) {
//   // this value gives me duration in minutes from the start of the day till the first train time
//   var firstTrainTimeVariable = moment
//     .duration(childSnapshot.val().firstTrain)
//     .asMinutes();
//   console.log(firstTrainTimeVariable);

//   // current time in hh:mm format
//   var timeNow = moment().format('HH:mm');
//   // current time in minutes
//   var currentMin = moment.duration(timeNow).asMinutes();
//   // number of minutes passed from first train time till current time
//   var numMin = moment.duration(timeNow).asMinutes() - firstTrainTimeVariable;
//   // frequency of train time
//   var freq = childSnapshot.val().frequencyMin;
//   // time remaining till next train
//   var remaining = numMin % freq;
//   // minutes away from next train
//   var minAway = freq - remaining;
//   // next train arrival in minutes
//   var answer = currentMin + minAway;
//   // function to convert next train arrival minutes to hh:mm a
//   function getTimeFromMin(mins) {
//     if (mins >= 24 * 60 || mins < 0) {
//     }
//     var h = (mins / 60) | 0;
//     var m = mins % 60 | 0;

//     return moment
//       .utc()
//       .hours(h)
//       .minutes(m)
//       .format('hh:mm A');
//   }

//   var arrivalTime = getTimeFromMin(answer);

//   var newRow = $('<tr>').append(
//     $('<td>').text(trainName),
//     $('<td>').text(cityDestination),
//     $('<td>').text(frequencyMin),
//     $('<td>').text(arrivalTime),
//     $('<td>').text(minAway)
//   );

//   // // Append the new row to the table
//   $('#train-table > tbody').append(newRow);
// });

// Attempt #2 no good!!
// database.ref().on('child_added', function(childSnapshot) {
//   console.log(childSnapshot.val());
//   console.log(firstTrainTime);
// //  create local variables to store the data from firebase
// var trainDiff = 0;
// var trainRemainder = 0;
// var minutesTillArrival = '';
// var nextTrainTime = '';
// var frequency = childSnapshot.val().frequency;
// var trainName = childSnapshot.val().trainName;
// var cityDestination = childSnapshot.val().city;
// var firstTrainTime = childSnapshot.val().firstTrain;

// // compute the difference in time from 'now' and the first train using UNIX timestamp, store in var and convert to minutes
// trainDiff = moment().diff(moment.unix(childSnapshot.val().time), 'minutes');
// console.log(trainDiff);

// // get the remainder of time by using 'moderator' with the frequency & time difference, store in var
// trainRemainder = trainDiff % frequency;

// // subtract the remainder from the frequency, store in var
// minutesTillArrival = frequency - trainRemainder;

// // add minutesTillArrival to now, to find next train & convert to standard time format
// nextTrainTime = moment()
//   .add(minutesTillArrival, 'm')
//   .format('hh:mm A');

// // THIS IS THE FIRST CODE I GOT FROM OTHER STUDENT -----START------<<<<<<<<<<<<<<<<<<<<<<<<<
// // Store everything into a variable.
//   var trainName = childSnapshot.val().trainName;
//   var cityDestination = childSnapshot.val().city;
//   var firstTrainTime = childSnapshot.val().firstTrain;
//   var frequencyMin = childSnapshot.val().frequency;

//   var nextArr;
//   var minAway;
// // Chang year so first train comes before now
//   var firstTrainNew = moment(childSnapshot.val().firstTrain, 'hh:mm').subtract(
//     1,
//     'years'
//   );
// // Difference between the current and firstTrain
//   var diffTime = moment().diff(moment(firstTrainNew), 'minutes');
//   var remainder = diffTime % childSnapshot.val().frequency;
// // Minutes until next train
//   var minAway = childSnapshot.val().frequency - remainder;
// // Next train time
//   var nextTrain = moment().add(minAway, 'minutes');
//   nextTrain = moment(nextTrain).format('hh:mm');

// // Train Info
//   console.log(trainName);
//   console.log(cityDestination);
//   console.log(firstTrainNew);
//   console.log(firstTrainTime);
//   console.log(frequencyMin);
//   console.log(nextArr);
//   console.log(minAway);
// // END OF CODE ------------<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
