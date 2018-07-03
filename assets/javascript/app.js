var config = {
  apiKey: "AIzaSyADePX2QZfOnKm_bRxbPJdBMu035I_2Ec8",
  authDomain: "homework1-e6b68.firebaseapp.com",
  databaseURL: "https://homework1-e6b68.firebaseio.com",
  projectId: "homework1-e6b68",
  storageBucket: "homework1-e6b68.appspot.com",
  messagingSenderId: "649587614970"
};

firebase.initializeApp(config);

  var database = firebase.database();

//button for adding trains
$("#add-train-btn").on("click", function(event) {

  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrain = moment($("#first-train").val().trim(), "MM/DD/YYYY").format("X");
  var frequency = $("#frequency").val().trim();

  // Creates local "temporary" object for holding new train data
  var newTrain = {
    name: trainName,
    destination: destination,
    first: firstTrain,
    frequency: frequency,
  };

// Uploads train data to the database
database.ref().push(newTrain);

// console.log(newTrain.name);
// console.log(newTrain.destination);
// console.log(newTrain.first);
// console.log(newTrain.frequency);

alert("New train information successfully added");

// Clears all of the text-boxes
$("#train-name").val("");
$("#destination").val("");
$("#first-train").val("");
$("#frequency").val("");
});

//  Firebase event for adding new trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  
  // console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().first;
  var frequency = childSnapshot.val().frequency;

  // train Info
  // console.log(trainName);
  // console.log(destination);
  // console.log(firstTrain);
  // console.log(frequency);

  // Calculate next arrival
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    // console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    // console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextTrain),
    $("<td>").text(tMinutesTillTrain),
  );
  
  $("#train-table > tbody").append(newRow);

});