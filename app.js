const csvtojson = require("csvtojson");
const ObjectsToCsv = require('objects-to-csv');
const filePath = __dirname + '/input.csv';

csvtojson()
  .fromFile(filePath)
  .then((csvdata) => {
    let data = [];
    for (let i = 0; i < csvdata.length; i++) {
      data.push(csvdata[i]);
    }
    let outputData = [];
    for (let i = 0; i < data.length; i++) {
      const dt = new Date(parseInt(data[i].created_at) * 1000).toLocaleString();
      const date = dt.split(',')[0].split('/');
      const month = date[1];
      const year = date[2];
      const outputObj = {
        instructorId: data[i].instructor_user_id,
        monthStartDate: data[i].created_at,
        monthEndDate: data[i].created_at,
        eventBookingEarnings: 0,
        subscriptionEarnings: 0,
        donationEarnings: 0,
      }
      if (month == '1' || month == '3' || month == '5' || month == '7' || month == '8' || month == '10' || month == '12') {
        outputObj.monthStartDate = '01-' + month + '-' + year;
        outputObj.monthEndDate = '31-' + month + '-' + year;
      }
      else if (month == '2') {
        outputObj.monthStartDate = '01-' + month + '-' + year;
        outputObj.monthEndDate = '29-' + month + '-' + year;
      }
      else {
        outputObj.monthStartDate = '01-' + month + '-' + year;
        outputObj.monthEndDate = '30-' + month + '-' + year;
      }
      if (data[i].product_kind == '1') {
        outputObj.eventBookingEarnings += parseFloat(data[i].charge_amount);
        outputObj.eventBookingEarnings += parseFloat(data[i].charge_application_fee);
        outputObj.eventBookingEarnings += parseFloat(data[i].credit_amount);
        outputObj.eventBookingEarnings += parseFloat(data[i].credit_application_fee);
      }
      if (data[i].product_kind == '2' || data[i].product_kind == '3') {
        outputObj.donationEarnings += parseFloat(data[i].charge_amount);
        outputObj.donationEarnings += parseFloat(data[i].charge_application_fee)
        outputObj.donationEarnings += parseFloat(data[i].credit_amount)
        outputObj.donationEarnings += parseFloat(data[i].credit_application_fee)
      }
      if (data[i].product_kind == '4' || data[i].product_kind == '5' || data[i].product_kind == '6') {
        outputObj.subscriptionEarnings += parseFloat(data[i].charge_amount)
        outputObj.subscriptionEarnings += parseFloat(data[i].charge_application_fee)
        outputObj.subscriptionEarnings += parseFloat(data[i].credit_amount)
        outputObj.subscriptionEarnings += parseFloat(data[i].credit_application_fee)
      }
      outputData.push(outputObj);
    }
    (async () => {
      const csv = new ObjectsToCsv(outputData);
      await csv.toDisk('./output.csv');
      console.log(await csv.toString());
    })();
  })