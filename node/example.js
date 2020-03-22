$("#image-selector").change(function () {
	let reader = new FileReader();
	reader.onload = function () {
		dataURL = reader.result;
		$("#selected-image").attr("src", dataURL);
		$("#prediction-list").empty();
	}
	
	let file = $("#image-selector").prop('files')[0];
	reader.readAsDataURL(file);
});

let model;
$( document ).ready(async function () {
	$('.progress-bar').show();
    console.log( "Loading model..." );
    model = await tf.loadLayersModel('model/model.json');
    console.log( "Model loaded." );
	$('.progress-bar').hide();
});

$("#predict-button").click(async function () {
	let image = $('#selected-image').get(0);
	
	// Pre-process the image
	let tensor = tf.browser.fromPixels(image)
		.resizeNearestNeighbor([96,96]) // change the image size here
		.toFloat()
		.div(tf.scalar(255.0))
		.expandDims();

	predictions = await model.predict(tensor).data();
	
	let top5 = Array.from(predictions)
		.map(function (p, i) { // this is Array.map
			return {
				probability: p,
				className: TARGET_CLASSES[i] // we are selecting the value from the obj
			};
		}).sort(function (a, b) {
			return b.probability - a.probability;
		}).slice(0, 2);

	$("#prediction-list").empty();
	top5.forEach(function (p) {
		$("#prediction-list").append(`<li>${p.className}: ${p.probability.toFixed(6)}</li>`);
		});
	
});
'use strict';
const { Contract} = require('fabric-contract-api');
class testContract extends Contract {

   async initLedger(ctx,name) {
	if(predictions[0]<predictions[1]){
   
    	let data={
       certif:dataURL
       };

    await ctx.stub.putState(name,Buffer.from(JSON.stringify(data))); 
    
    console.log('Certif added To the ledger Succesfully..');
	}
	else{
		console.log("Certif Cannot be Added to the ledger.")
	}
    }

   async query(ctx,name) {
   
    let dataAsBytes = await ctx.stub.getState(name); 
    if (!dataAsBytes || dataAsBytes.toString().length <= 0) {
      throw new Error('Student with this Id does not exist: ');
       }
      let data=JSON.parse(dataAsBytes.toString());
      
      return JSON.stringify(data);
     }

   async add(ctx,name) {
	if(predictions[0]>predictions[1]){
   
    	let data={
       certif:dataURL
       };

    await ctx.stub.putState(name,Buffer.from(JSON.stringify(data))); 
    
    console.log('Certif added To the ledger Succesfully..');
	}
	else{
		console.log("Certif Cannot be Added to the ledger.")
	}
    
  }

   async deleteMarks(ctx,name) {
   

    await ctx.stub.deleteState(name); 
    
    console.log('Certif deleted from the ledger Succesfully..');
    
    }
}

module.exports=testContract;
