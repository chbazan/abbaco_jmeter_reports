/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 0.0, "KoPercent": 100.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "yield-curves"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "appraiser-5-tickers-dinamico"], "isController": false}, {"data": [0.0, 500, 1500, "bond-payment-forecast-cashflow"], "isController": false}, {"data": [0.0, 500, 1500, "investments-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "investments-exchange-rate-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bond-laws"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves-uuid-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "investments"], "isController": false}, {"data": [0.0, 500, 1500, "instrument-issuers"], "isController": false}, {"data": [0.0, 500, 1500, "currencies-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "investments-price-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-coupons"], "isController": false}, {"data": [0.0, 500, 1500, "markets-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-params"], "isController": false}, {"data": [0.0, 500, 1500, "debt-types"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "bond-screener-filter"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "investments-irr-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bond-payment-forecast"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-payment-summary"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-issue-conditions"], "isController": false}, {"data": [0.0, 500, 1500, "currencies"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15624, 15624, 100.0, 96.59491807475699, 77, 1084, 93.0, 109.0, 115.0, 141.0, 257.37159424109643, 239.8814316130201, 88.13105762815866], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["yield-curves", 241, 241, 100.0, 97.08713692946061, 79, 725, 92.0, 108.80000000000001, 116.0, 147.31999999999994, 4.040031515598545, 3.764626910004526, 0.9587184162992641], "isController": false}, {"data": ["tradable-securities-uuid", 1235, 1235, 100.0, 95.9805668016195, 78, 700, 93.0, 109.0, 114.0, 135.9200000000003, 20.634231103388355, 19.225564334734013, 3.707713401390096], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 602, 602, 100.0, 94.65116279069767, 78, 257, 92.0, 107.0, 112.0, 125.91000000000008, 10.300106080826746, 9.602981544930364, 11.632131582999692], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1216, 1216, 100.0, 97.57894736842103, 79, 731, 94.0, 111.0, 117.0, 142.82999999999993, 20.28932307743647, 18.927760348013614, 10.441868419735371], "isController": false}, {"data": ["investments-metrics", 505, 505, 100.0, 95.73465346534653, 78, 703, 92.0, 108.0, 113.69999999999999, 137.94, 8.430999365588168, 7.854400658202277, 1.226776274875622], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, 100.0, 121.66666666666664, 83, 708, 92.0, 139.0, 569.75, 708.0, 0.42337002540220153, 0.39427367233806093, 0.07690119602032176], "isController": false}, {"data": ["bond-laws", 31, 31, 100.0, 93.38709677419355, 83, 110, 92.0, 105.0, 107.6, 110.0, 0.5765403857241161, 0.5369286612639254, 0.07713479769941788], "isController": false}, {"data": ["yield-curves-uuid-metrics", 595, 595, 100.0, 94.81680672268908, 78, 724, 91.0, 106.0, 112.19999999999993, 130.15999999999985, 9.935378295790406, 9.25755550557717, 2.4838445739476014], "isController": false}, {"data": ["investments", 1243, 1243, 100.0, 95.37409493161695, 78, 707, 92.0, 109.0, 114.0, 133.0, 20.75021284409796, 19.352543121796906, 8.916107081448342], "isController": false}, {"data": ["instrument-issuers", 30, 30, 100.0, 119.7333333333333, 83, 736, 93.5, 136.8, 413.1499999999996, 736.0, 0.508785021368971, 0.47519726019265995, 0.0725416143748728], "isController": false}, {"data": ["currencies-uuid", 1222, 1222, 100.0, 97.06873977086727, 79, 726, 94.0, 110.0, 118.0, 144.53999999999996, 20.386713601708347, 18.995159693490265, 4.678591500392052], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, 100.0, 100.42499999999998, 78, 701, 93.0, 107.0, 112.89999999999998, 588.0199999999957, 2.052931414982978, 1.9145155883786973, 0.36287166612492083], "isController": false}, {"data": ["bonds-coupons", 263, 263, 100.0, 102.98098859315593, 80, 1084, 94.0, 112.0, 120.59999999999997, 398.12000000000705, 4.395200374344062, 4.096901477739897, 0.7640094400715265], "isController": false}, {"data": ["markets-uuid", 1230, 1230, 100.0, 96.48373983739819, 79, 738, 93.0, 109.0, 115.0, 142.3800000000001, 20.50546812483329, 19.109864844166776, 3.4442778490930914], "isController": false}, {"data": ["tradable-securities-params", 1243, 1243, 100.0, 95.32421560740156, 77, 700, 92.0, 107.0, 113.0, 134.55999999999995, 20.764424843807422, 19.3469067396679, 4.035273968669607], "isController": false}, {"data": ["debt-types", 30, 30, 100.0, 95.89999999999999, 82, 114, 93.5, 109.7, 112.9, 114.0, 0.5400928959781083, 0.5031549020181472, 0.07278595668454975], "isController": false}, {"data": ["tradable-securities-metrics", 1234, 1234, 100.0, 96.00162074554297, 77, 699, 93.0, 109.0, 116.0, 135.6500000000001, 20.61270170046437, 19.206778602420407, 3.8648815688370695], "isController": false}, {"data": ["bonds-uuid", 1217, 1217, 100.0, 97.41166803615438, 79, 733, 94.0, 110.0, 118.0, 151.63999999999987, 20.3334892735414, 18.94675159664673, 4.765661548486267], "isController": false}, {"data": ["bond-screener-filter", 30, 30, 100.0, 92.10000000000001, 80, 109, 90.0, 102.9, 109.0, 109.0, 0.5388511693070374, 0.5018402328735136, 0.37730106288393145], "isController": false}, {"data": ["yield-curves-uuid", 598, 598, 100.0, 94.50501672240797, 78, 722, 91.0, 106.0, 111.0, 133.07999999999993, 9.98113931867875, 9.29950315979003, 2.729217782451221], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, 100.0, 95.0, 81, 122, 91.0, 112.9, 121.55, 122.0, 0.36359008853418656, 0.33832696861308564, 0.06249204646681332], "isController": false}, {"data": ["bond-payment-forecast", 1219, 1219, 100.0, 97.35849056603766, 79, 733, 94.0, 111.0, 118.0, 143.5999999999999, 20.33225472862528, 18.965484214981487, 20.01456324849051], "isController": false}, {"data": ["bonds-payment-summary", 221, 221, 100.0, 100.24886877828048, 78, 731, 95.0, 114.0, 122.79999999999995, 158.82000000000002, 3.7041382431322596, 3.451694962749108, 1.0490235258870657], "isController": false}, {"data": ["bonds-issue-conditions", 1224, 1224, 100.0, 96.8815359477124, 79, 733, 93.0, 109.0, 114.0, 146.0, 20.436103783350585, 19.04156653316693, 3.7319837963735933], "isController": false}, {"data": ["currencies", 31, 31, 100.0, 113.09677419354843, 82, 698, 90.0, 106.6, 351.79999999999916, 698.0, 0.5192542838478418, 0.48408553667442755, 0.10040268379089128], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["521", 15624, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15624, 15624, "521", 15624, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["yield-curves", 241, 241, "521", 241, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-uuid", 1235, 1235, "521", 1235, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 602, 602, "521", 602, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1216, 1216, "521", 1216, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-metrics", 505, 505, "521", 505, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, "521", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-laws", 31, 31, "521", 31, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid-metrics", 595, 595, "521", 595, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments", 1243, 1243, "521", 1243, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["instrument-issuers", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies-uuid", 1222, 1222, "521", 1222, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, "521", 120, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-coupons", 263, 263, "521", 263, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["markets-uuid", 1230, 1230, "521", 1230, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-params", 1243, 1243, "521", 1243, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["debt-types", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-metrics", 1234, 1234, "521", 1234, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-uuid", 1217, 1217, "521", 1217, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-screener-filter", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid", 598, 598, "521", 598, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, "521", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast", 1219, 1219, "521", 1219, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-payment-summary", 221, 221, "521", 221, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-issue-conditions", 1224, 1224, "521", 1224, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies", 31, 31, "521", 31, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
