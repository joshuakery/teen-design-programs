var fs = require('fs');
var Papa = require('papaparse');
var States = require('./states.json')

const deserializeData = data => {
    const deserialized = [];
    for (let i=1; i<data.length; i++) {
        const row = data[i];
        const entry = {};
        entry.programName = row[0];
        entry.orgName = row[1];
        entry.period = row[4];
        entry.applicationWindow = row[12];
        entry.link = row[17];
        entry.categories = parseCategories(row[2]);
        entry.location = parseLocation(row[10], row[11]);
        entry.lengths = parseLengths(row[3]);
        entry.finances = parseFinances(row[5],row[6],row[7],row[8],row[9]);
        entry.ageGroup = parseAgeGroup(row[13]);
        entry.gradeBand = parseGradeBand(row[14]);
        deserialized.push(entry);
    }
    return deserialized;
}
  
const parseCategories = rowInfo => {
    const categories = [];
    const cats = rowInfo.split('\n');
    cats.forEach(cat => {
        if (cat == '') return;
        if (!categories.includes(cat)) {
        categories.push(cat);
        }
    });
    return categories;
}
  
const parseLocation = (locationString, isRemote) => {
    const location = {};

    location.isRemote = (isRemote === "TRUE");

    const locationEnding = locationString.substr(locationString.length - 2, 2);
    location.state = null;
    if (States[locationEnding]) location.state = locationEnding;

    const locationBeginning = locationString.substr(0,locationString.length - 2).trim();
    location.city = locationString;
    if (States[locationEnding]) location.city = locationBeginning;

    const formatted = locationString.toUpperCase();
    if (location.isRemote) {
        if (formatted !== "") {
            location.formatted = `${formatted} & REMOTE`;
        } else {
            location.formatted = "REMOTE";
        }
    } else {
        location.formatted = formatted;
    }

    return location;
}
  
const parseLengths = rowInfo => {
    const parsed = {};
    const lengths = [];
    if (!rowInfo) return null;
    const lens = rowInfo.split(' - ');
    lens.forEach(len => {
        if (len.endsWith('day')) {
        const num = parseInt(len.substr(0,len.length - 3).trim());
        const length = num;
        lengths.push(length);
        }
        else if (len.endsWith('week')) {
        const num = parseInt(len.substr(0,len.length - 4).trim());
        const length = num * 7;
        lengths.push(length);
        }
        else if (len.endsWith('month')) {
        const num = parseInt(len.substr(0,len.length - 5).trim());
        const length = num * 30;
        lengths.push(length);
        }
        else if (len.endsWith('year')) {
        const num = parseInt(len.substr(0,len.length - 4).trim());
        const length = num * 365;
        lengths.push(length);
        } else if (len === "indefinite") {
            lengths.push(3650);
        }
    });
    parsed.lengths = lengths;
    if (rowInfo === "indefinite") {
        parsed.text = "indefinite term";
    } else if (lengths[lengths.length-1] === 3650) {
        parsed.text = `${rowInfo.split(' - ')[0]}+`
    } else {
        parsed.text = rowInfo;
    }
    return parsed;
}

const parseFinances = (isPaid, cost, hourlyPay, stipend, aidAvailable) => {
    return {
        isPaid: (isPaid === "TRUE"),
        cost: parseCost(cost),
        pay: parsePay(hourlyPay, stipend),
        aidAvailable: (aidAvailable === "TRUE"),
    }
}

const parsePay = (hourlyPay, stipend) => {
    const pay = {};
    // pay.originalHourlyPayText = hourlyPay;
    // pay.originalStipendText = stipend;
    if (hourlyPay !== "") {
        pay.hourlyPay = {
            formatted: `PAYS $${hourlyPay}/hr`,
            value: parseInt(hourlyPay),
        }
    }
    if (stipend !== "") {
        pay.stipend = {
            formatted: `PAYS $${stipend} stipend`,
            value: parseInt(stipend),
        }
    }
    return pay;
}

const parseCost = costString => {
    const cost = {};
    // cost.originalText = costString;
    if (costString === "0") {
        cost.formatted = "FREE";
        cost.value = 0;
    } else if (costString === "1") {
        cost.formatted = "COSTS, price unreported";
        cost.value = null;
    } else if (parseInt(costString)) {
        const priceNumber = parseInt(costString);
        cost.formatted = `COSTS $${priceNumber}`;
        cost.value = priceNumber;
    } else {
        cost.formatted = "pay or cost unreported";
        cost.value = 0;
    }
    return cost;
}

const parseAgeGroup = ageString => {
    const ageGroup = {};
    if (ageString == "") {
        ageGroup.value = [];
        ageGroup.formatted = "No ages specified";
    }
    else if (ageString == "all") {
        ageGroup.value = [0,100];
        ageGroup.formatted = "All ages";
    }
    else if (ageString.endsWith("+")) {
        const min = parseInt(ageString.substr(0,ageString.length-1));
        ageGroup.value = [min, 100];
        ageGroup.formatted = `Ages ${min}+`;
    }
    else {
        const ages = ageString.split("-");
        ageGroup.value = ages.map(age => (parseInt(age)));
        ageGroup.formatted = `Ages ${ages[0]} to ${ages[1]}`;
    }
    return ageGroup;
}

const parseGradeBand = gradeString => {
    const gradeBand = {};
    if (gradeString == "") {
        gradeBand.value = [];
        gradeBand.formatted = "No grades specified";
    }
    else {
        const grades = gradeString.split("-")
        gradeBand.value = grades.map(grade => (parseInt(grade)));
        gradeBand.formatted = (grades[0] !== grades[1]) ? `Grades ${grades[0]} to ${grades[1]}` : `Grade ${grades[0]}`;
    }
    return gradeBand;
}

const getSelectOptions = deserialized => {
    const selectOptions = {
      category: [],
      state: [],
      city: [],
    };
    deserialized.forEach(entry => {
        entry.categories.forEach(cat => {
            if (!selectOptions.category.includes(cat)) {
                selectOptions.category.push(cat);
            }
        });
        const state = entry.location.state;
        if (state && !selectOptions.state.includes(state)) {
            selectOptions.state.push(state);
        }
        const city = entry.location.city;
        if (!city == '' && !selectOptions.city.includes(city)) {
            selectOptions.city.push(city);
        }
    });
    Object.keys(selectOptions).forEach(optionName => {
        const options = selectOptions[optionName];
        options.sort();
    });
    return selectOptions;
  }

console.log('parsing csv...');
const data = fs.readFileSync('./teen-design-programs.csv',{encoding:'utf8', flag:'r'});
Papa.parse(data, {
    complete: function(results, file) {
        const deserialized = deserializeData(results.data);
        console.log(deserialized);
        const selectOptions = getSelectOptions(deserialized);
        fs.writeFileSync('./programs.json', JSON.stringify(deserialized));
        fs.writeFileSync('./selectOptions.json', JSON.stringify(selectOptions));
        console.log('finished parsing csv.');
    }
});