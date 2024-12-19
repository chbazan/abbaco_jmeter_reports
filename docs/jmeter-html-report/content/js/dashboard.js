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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "tradable-securities-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves"], "isController": false}, {"data": [0.0, 500, 1500, "appraiser-5-tickers-dinamico"], "isController": false}, {"data": [0.0, 500, 1500, "investments-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "bond-payment-forecast-cashflow"], "isController": false}, {"data": [0.0, 500, 1500, "investments-exchange-rate-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bond-laws"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves-uuid-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "investments"], "isController": false}, {"data": [0.0, 500, 1500, "currencies-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "instrument-issuers"], "isController": false}, {"data": [0.0, 500, 1500, "investments-price-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-coupons"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-params"], "isController": false}, {"data": [0.0, 500, 1500, "markets-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "debt-types"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "bond-screener-filter"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "investments-irr-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bond-payment-forecast"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-payment-summary"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-issue-conditions"], "isController": false}, {"data": [0.0, 500, 1500, "currencies"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 21249, 21249, 100.0, 68.81062638241826, 32, 1115, 57.0, 95.0, 100.0, 105.0, 234.77223259565346, 189.89594396344563, 80.23017306980522], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["tradable-securities-uuid", 1228, 1228, 100.0, 96.49429967426705, 79, 1101, 92.0, 108.0, 114.0, 138.71000000000004, 20.5056273586481, 16.584749957210366, 3.6846049160070797], "isController": false}, {"data": ["yield-curves", 240, 240, 100.0, 105.55416666666673, 79, 911, 92.0, 111.0, 233.39999999999986, 296.49, 4.035919685198264, 3.263452277351764, 0.9577426596710725], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 591, 591, 100.0, 98.32148900169196, 78, 295, 92.0, 108.0, 116.79999999999995, 268.5600000000003, 10.091868447115878, 8.17211152816673, 11.39759264219972], "isController": false}, {"data": ["investments-metrics", 504, 504, 100.0, 98.15476190476187, 80, 701, 93.0, 110.0, 120.0, 216.49999999999943, 8.415990381725278, 6.805182450823231, 1.224592350465885], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 2228, 2228, 100.0, 52.890035906642716, 32, 680, 49.0, 69.0, 78.54999999999973, 113.42000000000007, 37.231375956685945, 30.141922557526488, 19.161069462083486], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, 100.0, 95.79166666666667, 82, 123, 95.5, 114.0, 120.75, 123.0, 0.4574914220358368, 0.3700177814048799, 0.08309902783072817], "isController": false}, {"data": ["bond-laws", 30, 30, 100.0, 48.33333333333333, 36, 81, 46.0, 65.60000000000001, 73.29999999999998, 81.0, 0.5494505494505495, 0.44421073717948717, 0.0735104739010989], "isController": false}, {"data": ["yield-curves-uuid-metrics", 599, 599, 100.0, 99.57595993322218, 79, 958, 92.0, 107.0, 114.0, 258.0, 10.004509545204016, 8.089371852713244, 2.501127386301004], "isController": false}, {"data": ["investments", 1235, 1235, 100.0, 95.9295546558704, 79, 697, 92.0, 108.0, 114.0, 139.6400000000001, 20.614942912465782, 16.692880906974025, 8.85798328270014], "isController": false}, {"data": ["currencies-uuid", 2243, 2243, 100.0, 52.560855996433226, 32, 680, 49.0, 68.0, 77.0, 108.55999999999995, 37.417008641110336, 30.2510703643696, 8.586911162754813], "isController": false}, {"data": ["instrument-issuers", 30, 30, 100.0, 56.43333333333333, 36, 152, 51.0, 85.90000000000005, 117.89999999999995, 152.0, 0.5277044854881267, 0.427660510114336, 0.0752391160949868], "isController": false}, {"data": ["investments-price-sensitivity", 122, 122, 100.0, 95.11475409836065, 81, 210, 93.0, 106.0, 109.69999999999999, 196.65999999999977, 2.0582727380088746, 1.6640263853272146, 0.3638157866988342], "isController": false}, {"data": ["bonds-coupons", 260, 260, 100.0, 55.657692307692315, 34, 680, 47.0, 69.9, 91.94999999999999, 149.67999999999984, 4.377546553523925, 3.541909352165202, 0.7609407094992761], "isController": false}, {"data": ["tradable-securities-params", 1244, 1244, 100.0, 95.20418006430864, 79, 711, 92.0, 107.0, 111.0, 132.54999999999995, 20.770720630468176, 16.79799354984806, 4.036497466272624], "isController": false}, {"data": ["markets-uuid", 2241, 2241, 100.0, 52.66086568496203, 33, 696, 49.0, 69.0, 78.0, 106.0, 37.395497855724464, 30.231817852345355, 6.281275030453719], "isController": false}, {"data": ["debt-types", 30, 30, 100.0, 48.03333333333333, 37, 76, 45.5, 62.0, 70.5, 76.0, 0.5527814118037258, 0.44737146680547624, 0.07449593245011148], "isController": false}, {"data": ["tradable-securities-metrics", 1225, 1225, 100.0, 96.67428571428583, 79, 1115, 93.0, 109.0, 114.0, 136.74, 20.465100738414247, 16.54813201138528, 3.8372063884526715], "isController": false}, {"data": ["bonds-uuid", 2227, 2227, 100.0, 52.852716659182896, 34, 680, 49.0, 70.0, 78.0, 107.0, 37.251392536339765, 30.121880253374705, 8.730795125704631], "isController": false}, {"data": ["bond-screener-filter", 31, 31, 100.0, 51.35483870967742, 34, 97, 50.0, 73.2, 88.59999999999998, 97.0, 0.5339488098108788, 0.4320840797133901, 0.3738684537445313], "isController": false}, {"data": ["yield-curves-uuid", 597, 597, 100.0, 99.86599664991624, 80, 938, 92.0, 108.0, 115.10000000000002, 281.15999999999985, 9.978438549867121, 8.064797824842467, 2.728479290979291], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, 100.0, 94.64999999999999, 82, 110, 93.0, 109.9, 110.0, 110.0, 0.3518648838845883, 0.2846875549788881, 0.060476776917663615], "isController": false}, {"data": ["bond-payment-forecast", 1811, 1811, 100.0, 53.32799558255105, 33, 679, 49.0, 71.0, 81.0, 121.0, 30.251398981040676, 24.490210395264345, 29.778720871961912], "isController": false}, {"data": ["bonds-payment-summary", 220, 220, 100.0, 55.83181818181819, 33, 680, 47.0, 69.0, 89.89999999999998, 180.27999999999975, 3.722882187700951, 3.0104314735844584, 1.0543318695637458], "isController": false}, {"data": ["bonds-issue-conditions", 2239, 2239, 100.0, 52.63555158552925, 33, 681, 49.0, 69.0, 78.0, 108.0, 37.433959740520294, 30.26179620623788, 6.836084444802046], "isController": false}, {"data": ["currencies", 30, 30, 100.0, 51.63333333333334, 35, 99, 48.0, 77.70000000000003, 93.5, 99.0, 0.5407256538274364, 0.4366993317532128, 0.10455437447053946], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404/Not Found", 21249, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 21249, 21249, "404/Not Found", 21249, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["tradable-securities-uuid", 1228, 1228, "404/Not Found", 1228, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves", 240, 240, "404/Not Found", 240, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 591, 591, "404/Not Found", 591, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-metrics", 504, 504, "404/Not Found", 504, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 2228, 2228, "404/Not Found", 2228, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, "404/Not Found", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-laws", 30, 30, "404/Not Found", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid-metrics", 599, 599, "404/Not Found", 599, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments", 1235, 1235, "404/Not Found", 1235, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies-uuid", 2243, 2243, "404/Not Found", 2243, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["instrument-issuers", 30, 30, "404/Not Found", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-price-sensitivity", 122, 122, "404/Not Found", 122, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-coupons", 260, 260, "404/Not Found", 260, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-params", 1244, 1244, "404/Not Found", 1244, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["markets-uuid", 2241, 2241, "404/Not Found", 2241, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["debt-types", 30, 30, "404/Not Found", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-metrics", 1225, 1225, "404/Not Found", 1225, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-uuid", 2227, 2227, "404/Not Found", 2227, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-screener-filter", 31, 31, "404/Not Found", 31, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid", 597, 597, "404/Not Found", 597, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast", 1811, 1811, "404/Not Found", 1811, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-payment-summary", 220, 220, "404/Not Found", 220, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-issue-conditions", 2239, 2239, "404/Not Found", 2239, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies", 30, 30, "404/Not Found", 30, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
