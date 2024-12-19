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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "yield-curves"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "appraiser-5-tickers-dinamico"], "isController": false}, {"data": [0.0, 500, 1500, "bond-payment-forecast-cashflow"], "isController": false}, {"data": [0.0, 500, 1500, "investments-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "bond-laws"], "isController": false}, {"data": [0.0, 500, 1500, "investments-exchange-rate-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves-uuid-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "investments"], "isController": false}, {"data": [0.0, 500, 1500, "currencies-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "instrument-issuers"], "isController": false}, {"data": [0.0, 500, 1500, "investments-price-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-coupons"], "isController": false}, {"data": [0.0, 500, 1500, "markets-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-params"], "isController": false}, {"data": [0.0, 500, 1500, "debt-types"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "bond-screener-filter"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "investments-irr-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bond-payment-forecast"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-payment-summary"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-issue-conditions"], "isController": false}, {"data": [0.0, 500, 1500, "currencies"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 18865, 18865, 100.0, 75.4624966869868, 52, 1104, 73.0, 87.0, 94.0, 135.0, 314.6316649710635, 247.79724152650144, 106.66302311788054], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["yield-curves", 242, 242, 100.0, 76.04132231404958, 54, 748, 71.0, 82.70000000000002, 95.54999999999998, 193.2199999999997, 4.055707318708207, 3.2860479530828406, 0.962438357857514], "isController": false}, {"data": ["tradable-securities-uuid", 1599, 1599, 100.0, 74.0325203252031, 53, 668, 71.0, 85.0, 92.0, 135.0, 26.727956539908067, 21.64238795445048, 4.80267969076473], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 606, 606, 100.0, 73.37953795379542, 54, 179, 72.0, 84.30000000000007, 89.64999999999998, 130.7199999999998, 10.358443156761192, 7.539143291797002, 11.698418510589201], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1540, 1540, 100.0, 76.86948051948056, 52, 1104, 74.0, 89.0, 97.94999999999982, 140.76999999999975, 25.72282817484842, 18.725144299428752, 13.238213328266715], "isController": false}, {"data": ["investments-metrics", 506, 506, 100.0, 75.29841897233206, 52, 672, 71.0, 86.0, 94.0, 154.0, 8.4574370288656, 6.848718065235922, 1.230623161426733], "isController": false}, {"data": ["bond-laws", 30, 30, 100.0, 101.46666666666665, 55, 829, 75.5, 105.30000000000004, 452.7999999999995, 829.0, 0.50745107325902, 0.41025569190953837, 0.0678914033559431], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, 100.0, 68.0, 53, 85, 65.5, 79.5, 84.0, 85.0, 0.49411183397842373, 0.400138904615828, 0.08975078234373712], "isController": false}, {"data": ["yield-curves-uuid-metrics", 605, 605, 100.0, 73.94545454545464, 54, 739, 71.0, 84.0, 89.0, 138.21999999999923, 10.115196201367642, 8.194758802728595, 2.5287990503419104], "isController": false}, {"data": ["investments", 1407, 1407, 100.0, 73.53091684434973, 52, 677, 71.0, 85.0, 90.0, 127.84000000000015, 23.517023517023517, 17.112883044802686, 10.104971042471043], "isController": false}, {"data": ["currencies-uuid", 1553, 1553, 100.0, 76.24468770122358, 55, 777, 74.0, 89.0, 96.0, 131.76000000000022, 25.907081491367087, 20.985219524147134, 5.945472803194595], "isController": false}, {"data": ["instrument-issuers", 30, 30, 100.0, 73.90000000000003, 58, 106, 72.0, 87.30000000000001, 103.25, 106.0, 0.5696490961567674, 0.46113391026127903, 0.08121950003797661], "isController": false}, {"data": ["investments-price-sensitivity", 121, 121, 100.0, 80.54545454545459, 55, 677, 75.0, 89.0, 100.59999999999997, 556.4400000000006, 2.0331692235309933, 1.6474538651219062, 0.3593785443936619], "isController": false}, {"data": ["bonds-coupons", 261, 261, 100.0, 81.05363984674325, 53, 821, 73.0, 98.60000000000002, 110.89999999999998, 201.91999999999985, 4.370541545262735, 3.5413186769483236, 0.7597230420476238], "isController": false}, {"data": ["markets-uuid", 1556, 1556, 100.0, 76.15102827763498, 54, 813, 74.0, 88.0, 96.0, 142.43000000000006, 25.95193221808963, 21.016982743883116, 4.359113614757242], "isController": false}, {"data": ["tradable-securities-params", 1589, 1589, 100.0, 74.45248584015108, 53, 676, 72.0, 85.0, 91.0, 127.29999999999973, 26.556363332497703, 21.507713921617782, 5.160855764811565], "isController": false}, {"data": ["debt-types", 30, 30, 100.0, 78.46666666666668, 60, 116, 74.5, 104.10000000000002, 115.45, 116.0, 0.5355803906166315, 0.4338340638054772, 0.07217782607919448], "isController": false}, {"data": ["tradable-securities-metrics", 1593, 1593, 100.0, 74.25925925925931, 54, 1103, 71.0, 85.0, 91.0, 127.23999999999978, 26.635232744783305, 21.571192529636505, 4.99410613964687], "isController": false}, {"data": ["bonds-uuid", 1557, 1557, 100.0, 75.95825305073848, 53, 818, 74.0, 88.0, 93.0, 137.84000000000015, 26.036789297658864, 21.089814355142142, 6.102372491638796], "isController": false}, {"data": ["bond-screener-filter", 30, 30, 100.0, 73.23333333333333, 58, 91, 74.5, 81.9, 87.14999999999999, 91.0, 0.5753408894770152, 0.4191448276854036, 0.40285099390138657], "isController": false}, {"data": ["yield-curves-uuid", 606, 606, 100.0, 73.66666666666683, 54, 753, 71.0, 84.0, 90.0, 126.64999999999975, 10.1368304840922, 8.208339257636078, 2.7717895854939614], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, 100.0, 89.89999999999999, 57, 322, 76.0, 131.00000000000009, 312.64999999999986, 322.0, 0.35751952950429916, 0.2895244822670313, 0.06144866913355142], "isController": false}, {"data": ["bond-payment-forecast", 1552, 1552, 100.0, 76.28414948453612, 53, 809, 74.0, 89.0, 97.0, 129.47000000000003, 25.91028230855273, 18.861323462203043, 25.505434147481594], "isController": false}, {"data": ["bonds-payment-summary", 221, 221, 100.0, 77.99547511312225, 54, 811, 72.0, 87.80000000000001, 93.79999999999995, 163.44000000000005, 3.714785181200834, 3.008463191479527, 1.0520387720197675], "isController": false}, {"data": ["bonds-issue-conditions", 1555, 1555, 100.0, 76.13054662379433, 53, 817, 74.0, 89.0, 97.0, 139.44000000000005, 25.98900272424916, 21.050158618571693, 4.746038583432219], "isController": false}, {"data": ["currencies", 32, 32, 100.0, 97.28125, 56, 810, 73.0, 94.19999999999999, 350.44999999999845, 810.0, 0.535224459757811, 0.43302415932126853, 0.10349066702348297], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["405/Method Not Allowed", 5135, 27.21971905645375, 27.21971905645375], "isController": false}, {"data": ["404/Not Found", 13730, 72.78028094354624, 72.78028094354624], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 18865, 18865, "404/Not Found", 13730, "405/Method Not Allowed", 5135, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["yield-curves", 242, 242, "404/Not Found", 242, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-uuid", 1599, 1599, "404/Not Found", 1599, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 606, 606, "405/Method Not Allowed", 606, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1540, 1540, "405/Method Not Allowed", 1540, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-metrics", 506, 506, "404/Not Found", 506, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-laws", 30, 30, "404/Not Found", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, "404/Not Found", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid-metrics", 605, 605, "404/Not Found", 605, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments", 1407, 1407, "405/Method Not Allowed", 1407, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies-uuid", 1553, 1553, "404/Not Found", 1553, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["instrument-issuers", 30, 30, "404/Not Found", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-price-sensitivity", 121, 121, "404/Not Found", 121, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-coupons", 261, 261, "404/Not Found", 261, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["markets-uuid", 1556, 1556, "404/Not Found", 1556, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-params", 1589, 1589, "404/Not Found", 1589, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["debt-types", 30, 30, "404/Not Found", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-metrics", 1593, 1593, "404/Not Found", 1593, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-uuid", 1557, 1557, "404/Not Found", 1557, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-screener-filter", 30, 30, "405/Method Not Allowed", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid", 606, 606, "404/Not Found", 606, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast", 1552, 1552, "405/Method Not Allowed", 1552, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-payment-summary", 221, 221, "404/Not Found", 221, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-issue-conditions", 1555, 1555, "404/Not Found", 1555, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies", 32, 32, "404/Not Found", 32, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
