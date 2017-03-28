
//add by Neha
var retrievedObject = localStorage.getItem('survey');
var survey = JSON.parse(retrievedObject);
//add by rachel
/* queations to cretirion mapping explaination:
1)if user have kis, give credit to top three ares with lowest crime and highest shcool rate
2)if user use public transportation daily or a fews time a week, give credit to top three areas with the most bus stop
3)user's income and house price mapping:
user's income in '10-50',  give credit to top three areas with house price above '200' in ascding order
user's income in '50-100',  give credit to top three areas with house price above '500' in ascding order
user's income in '100-150',   give credit to top three areas with house price above '800' in ascding order
user's income in '150+',  give credit to top three areas with house price above '100' in ascding order
4)user's activity mapping:
user select hiking, give credit to top three area where support hiking activity
user select swimming, give credit to top three area where support swimming activity
user select travelling, give credit to top three area where support travelling activity

At last, sort areas by credit and choose top three
*/
//each element is in this format:{"area":"","score":"","detail":{"crime":"","school":"","transportation":"","housePrice":""}}
var suggestionList = [];
//question kids mapping
var suggestedNeighboors;
if (survey.kids === "YES") {
  suggestedNeighboors = getNeighboorByCrime();
  console.log(suggestedNeighboors);
   //set the score to the crime less Areas
   setScoreToNeighboors(suggestedNeighboors,credit.crime,criteria.crime);
   //set the score to the area with highest school rating
   suggestedNeighboors  = getNeighboorBySchool();
   setScoreToNeighboors(suggestedNeighboors,credit.school,criteria.school);
}
//question income range mapping
//filter three area with lowest average housing price that over the "housePrice"
var housePrice = incomeHousePriceMapping[survey.income];
suggestedNeighboors = getNeighboorByIncome(housePrice);
setScoreToNeighboors(suggestedNeighboors,credit.housePrice,criteria.housePrice);

//question public transportation mapping
if(survey.transportation === "DAILY" || survey.transportation === "FEW DAYS IN A WEEK"){
     suggestedNeighboors = getNeighboorByTransporation();
     setScoreToNeighboors(suggestedNeighboors,credit.transportation,criteria.transportation);
}
//question activity mapping
if(survey.activity === "Hiking" || survey.activity === "Swimming" || survey.activity === "Travelling"){
     suggestedNeighboors = getNeighboorByActivity(survey.activity);
     setScoreToNeighboors(suggestedNeighboors,credit[survey.activity.toLowerCase()],criteria.supportingAct,survey.activity);
}
//sort suggesting list by credit
suggestionList.sort(function(a, b) {
    return (a.score < b.score) ? 1 : ((a.score > b.score) ? -1 : 0)
});
console.log(suggestionList);
//this function to form the suggesting list according to filtered neighboorhood, credit and criteria
function setScoreToNeighboors(suggestedNeighboors,credit,criteria,sport){
    var modified = false;
    for(var n in suggestedNeighboors){
      var i = 0;
      for(i = 0;i<suggestionList.length;i++){
          if(suggestionList[i].area == suggestedNeighboors[n].area){
            var origScore = parseInt(suggestionList[i].score);
            suggestionList[i].score = origScore + parseInt(credit)
            if(typeof suggestionList[i].detail == "undefined")
                  suggestionList[i].detail = {};
            suggestionList[i].detail[criteria] = suggestedNeighboors[n].data;
            if(typeof sport !="undefined")
                suggestionList[i].detail[criteria].sport = sport;
            modified = true;
          }
      }
      if(!modified){
          suggestionList[i] = {};
          suggestionList[i].area = suggestedNeighboors[n].area;
          suggestionList[i].score = credit;
          if(typeof suggestionList[i].detail == "undefined")
               suggestionList[i].detail = {};
          suggestionList[i].detail[criteria] = suggestedNeighboors[n].data;
          if(typeof sport !="undefined")
              suggestionList[i].detail[criteria].sport = sport;
      }else modified = false;
    }

}
//get top three neighboors according to activity
function getNeighboorByActivity(selectedActivity){
  var activity = localStorage.getItem("activity");
  var activityObj = JSON.parse(activity);
  var neighboors= [];
  for(var n in activityObj){
      if(activityObj[n].sport == selectedActivity){
        var places = activityObj[n].place;
        //get top three area that support that activity
        neighboors = places.slice(0,neighboorhood.top);
        break;
      }
  }
  return neighboors;
}
//get top three neighboors according to bus stop number
function getNeighboorByTransporation(){
  var transportation = localStorage.getItem("transportation");
  var transportationObj = JSON.parse(transportation);
  var neighboors = transportationObj.slice(0,neighboorhood.top);
  // var neightboors = [transportationObj[0],transportationObj[1],transportationObj[2]];
  return neighboors;
}
//get top three neighboors according to income
function getNeighboorByIncome(minHousePrice){
     var housePrice = localStorage.getItem("housePrice");
     var housePriceObj = JSON.parse(housePrice);
     var neighboors= [];
     for(var n in housePriceObj){
          if(housePriceObj[n].data >= minHousePrice){
            neighboors[0] = housePriceObj[n];
            n++;
            if(n< housePriceObj.length) neighboors[1] = housePriceObj[n];
            n++;
            if(n< housePriceObj.length) neighboors[2] = housePriceObj[n];
            break;
          }
     }
     return neighboors;
}
//get top three highest rating school area
function getNeighboorBySchool(){
     var schoolRating = localStorage.getItem("schoolRating");
     var schoolRatingObj = JSON.parse(schoolRating);
    //  var neighboors = [schoolRatingObj[0],schoolRatingObj[1],schoolRatingObj[2]];
    //Start Edit by sirisha
    neighboors = schoolRatingObj.slice(0,neighboorhood.top);
    //End edited
     return neighboors;
}
//get top three least crime area
function getNeighboorByCrime(){
  //{ area: 'Queen Anne',          crimeCount: '2,448',  },
   var crimeRecords = localStorage.getItem("crimeRecords");
   var crimeRecordsObj = JSON.parse(crimeRecords);
   console.log(crimeRecordsObj);
  //  var neighboors = [crimeRecordsObj[0],crimeRecordsObj[1],crimeRecordsObj[2]];
  //Start edit by sirisha
  var neighboors = crimeRecordsObj.slice(0,neighboorhood.top);
  //end edit
   return neighboors;
}
//end by rachel
//start by neha

  //start edit by sirisha
   //Collected the suggestion list and printing the top three nieghbourhood.
    var safeAreas = suggestionList.slice(0,neighboorhood.top);

    //Showing each nieghbourhood in suggestionsPage.html
    safeAreas.forEach(function(safeArea, i) {
        $('#suggestedArea').append('<div id="area' + i + '"></div>');

        //Displays top 3 area/suburb name
        $('#area' + i).append('<h2>' + safeArea.area + '</h2>');

        //addClass
        $('#area' + i).addClass('area');

        //crime
        $('#area' + i).append('<div id="crime"></div>');
        $('#area' + i).find('div#crime').append('<h4 class="suggestions">No. of crimes(per 100K): ' + safeArea.detail.crime + '</h4>');

        //schools
        $('#area' + i).append('<div id="schools"></div>');
        $('#area' + i).find('div#schools').append('<h4 class="suggestions">School Rating: ' + safeArea.detail.school + '</h4>');

         //grocery
        $('#area' + i).append('<div id="grocery"></div>');
        $('#area' + i).find('div#grocery').append('<h4 class="suggestions">Grocery Stores: ' + + '</h4>');

        //transport
        $('#area' + i).append('<div id="transport"></div>');
        $('#area' + i).find('div#transport').append('<h4 class="suggestions">Transportion Rating: ' + safeArea.detail.transportation + '</h4>');

        //income
        $('#area' + i).append('<div id="income"></div>');
        $('#area' + i).find('div#income').append('<h4 class="suggestions">Avg Income Range: ' + safeArea.detail.housePrice +  '</h4>');


    });
//end edited by sirisha
//end by neha
