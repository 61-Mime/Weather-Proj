/* jshint esversion: 8 */


const item = document.getElementById('dbSearch');
let searchItem = '';
item.addEventListener('change', function() {
    searchItem = this.value;
});

getData();
        
async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    let idNumber = 0;

    for (let item of data) {
        idNumber++;
        weatherDataToHTML(item, idNumber);
    }

    let hideInfo = idNumber;

    
    const button = document.getElementById('search');
    button.onclick = async () => {
        const searchType = getSelectedFilter();
        
        const res = await fetch(`/dbSearch?SI=${searchItem}&ST=${searchType}`);
        const resData = await res.json();
        for (let item of resData) {
            idNumber++;
            weatherDataToHTML(item, idNumber);
        }

        while (hideInfo > 0) {
            document.getElementById(hideInfo).style.display = 'none';
            hideInfo--;
        }
    };
}

// const searchType = getSelectedFilter();

function getSelectedFilter() {
    if (document.getElementById('lat').checked) {
        return 'lat';
    }
    else if (document.getElementById('lon').checked) {
        return 'lon';
    }
    else if (document.getElementById('name').checked) {
        return 'nameVal';
    }
    else if (document.getElementById('timestamp').checked) {
        return 'timestamp';
    }
    else if (document.getElementById('id').checked) {
        return '_id';
    }
    else {
        return '';
    }
}

function weatherDataToHTML (item, idNumber) {
    const root = document.createElement('div');
    root.setAttribute('id', idNumber);
    const name = document.createElement('div');
    const location = document.createElement('div');
    const date = document.createElement('div');

    name.textContent = `Name: ${item.nameVal}`;
    location.textContent = `latitude: ${item.lat}º   longitude: ${item.lon}º`;
    const dateString = new Date(item.timestamp).toLocaleString();
    date.textContent = `Date: ${dateString}`;

    root.append(name, location, date);
    document.body.append(root);
}