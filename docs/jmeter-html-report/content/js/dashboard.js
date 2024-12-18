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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 28714, 28714, 100.0, 42.78982377934065, 21, 668, 34.0, 43.0, 44.0, 45.0, 453.28113407106883, 422.1605058250588, 139.10002582501934], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["yield-curves", 243, 243, 100.0, 46.77366255144033, 32, 656, 41.0, 56.0, 64.79999999999998, 106.04000000000002, 4.064088841316564, 3.7853719717938854, 0.9644273324608643], "isController": false}, {"data": ["tradable-securities-uuid", 3249, 3249, 100.0, 36.33210218528772, 21, 594, 33.0, 48.0, 56.0, 76.0, 54.29841566949663, 50.58527161742095, 9.756746565612675], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 606, 606, 100.0, 43.255775577557685, 32, 145, 41.0, 54.0, 60.0, 77.0, 10.440895229234506, 9.737038661248084, 11.790493465825882], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 2485, 2485, 100.0, 47.28008048289737, 22, 641, 44.0, 67.0, 79.0, 112.27999999999975, 41.51699941525353, 38.68107692548659, 21.366658878748645], "isController": false}, {"data": ["investments-metrics", 505, 505, 100.0, 37.255445544554455, 21, 603, 32.0, 50.0, 61.39999999999998, 86.94, 8.435505963318077, 7.858533798399759, 1.2274320200531186], "isController": false}, {"data": ["bond-laws", 30, 30, 100.0, 41.733333333333334, 25, 101, 38.5, 56.7, 85.59999999999998, 101.0, 0.5428194039842944, 0.5049528029836973, 0.07262329916586752], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 25, 25, 100.0, 35.64, 27, 56, 34.0, 46.60000000000001, 53.89999999999999, 56.0, 0.4343067595504056, 0.4051776694664976, 0.0788877512464604], "isController": false}, {"data": ["yield-curves-uuid-metrics", 603, 603, 100.0, 44.99170812603645, 32, 664, 41.0, 54.0, 63.0, 96.0, 10.07687165775401, 9.388594193892045, 2.5192179144385025], "isController": false}, {"data": ["investments", 1405, 1405, 100.0, 37.08469750889682, 21, 601, 33.0, 50.0, 60.0, 83.88000000000011, 23.512676763450756, 21.920776111831646, 10.103103296795247], "isController": false}, {"data": ["currencies-uuid", 2469, 2469, 100.0, 47.67800729040095, 22, 650, 43.0, 68.0, 80.0, 111.30000000000018, 41.185694268365914, 38.334639369745446, 9.451795071353507], "isController": false}, {"data": ["instrument-issuers", 30, 30, 100.0, 45.933333333333344, 30, 79, 45.0, 67.0, 74.05, 79.0, 0.5402582434403645, 0.5022713356984638, 0.07702900736552071], "isController": false}, {"data": ["investments-price-sensitivity", 121, 121, 100.0, 41.727272727272705, 23, 604, 34.0, 52.599999999999994, 67.99999999999991, 496.20000000000056, 2.0261219022103147, 1.886325639442398, 0.35813287529303417], "isController": false}, {"data": ["bonds-coupons", 261, 261, 100.0, 44.93486590038316, 24, 646, 36.0, 67.0, 82.69999999999993, 129.25999999999988, 4.370395177494976, 4.0677458347287345, 0.759697599212994], "isController": false}, {"data": ["markets-uuid", 2494, 2494, 100.0, 47.255012028869295, 22, 646, 43.0, 67.0, 78.25, 113.0, 41.60688665710186, 38.724249847769514, 6.988656743185079], "isController": false}, {"data": ["tradable-securities-params", 3238, 3238, 100.0, 36.44935145151322, 21, 607, 34.0, 48.09999999999991, 55.0, 78.0, 54.062176511837585, 50.360503425843994, 10.506223755718436], "isController": false}, {"data": ["debt-types", 30, 30, 100.0, 48.633333333333326, 25, 185, 40.5, 63.900000000000006, 123.94999999999992, 185.0, 0.546448087431694, 0.5089509335154827, 0.07364241803278689], "isController": false}, {"data": ["tradable-securities-metrics", 3240, 3240, 100.0, 36.413888888888984, 21, 612, 34.0, 49.0, 56.0, 73.59000000000015, 54.13895665541556, 50.435473183253684, 10.15105437289042], "isController": false}, {"data": ["bonds-uuid", 2477, 2477, 100.0, 47.51069842551479, 21, 649, 43.0, 69.0, 79.0, 112.2199999999998, 41.395791901331954, 38.52787703469425, 9.702138726874676], "isController": false}, {"data": ["bond-screener-filter", 30, 30, 100.0, 58.2, 24, 497, 37.5, 92.40000000000006, 275.89999999999975, 497.0, 0.5177323323841574, 0.4821045280006903, 0.3625137522650789], "isController": false}, {"data": ["yield-curves-uuid", 604, 604, 100.0, 44.7086092715232, 32, 668, 41.0, 54.0, 60.0, 103.4500000000005, 10.100334448160535, 9.407971232232441, 2.7618102006688963], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, 100.0, 51.1, 26, 378, 32.5, 50.20000000000002, 361.64999999999975, 378.0, 0.3545282115824367, 0.33037943935794944, 0.060934536365731304], "isController": false}, {"data": ["bond-payment-forecast", 1808, 1808, 100.0, 47.94856194690263, 21, 647, 43.0, 71.0, 81.54999999999995, 119.91000000000008, 30.213398840260023, 28.153692571773533, 29.741314483380958], "isController": false}, {"data": ["bonds-payment-summary", 221, 221, 100.0, 47.46153846153847, 24, 643, 38.0, 65.80000000000001, 98.19999999999982, 180.26000000000002, 3.7086137168364353, 3.450408304106325, 1.0502909940259435], "isController": false}, {"data": ["bonds-issue-conditions", 2490, 2490, 100.0, 47.21606425702816, 22, 646, 43.0, 68.0, 78.0, 109.0, 41.63183414144792, 38.74761941460458, 7.602688461377696], "isController": false}, {"data": ["currencies", 30, 30, 100.0, 65.66666666666667, 29, 644, 36.5, 114.50000000000006, 360.74999999999966, 644.0, 0.6129704548240775, 0.5698909231845858, 0.11852358403824935], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["521", 28714, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 28714, 28714, "521", 28714, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["yield-curves", 243, 243, "521", 243, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-uuid", 3249, 3249, "521", 3249, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 606, 606, "521", 606, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 2485, 2485, "521", 2485, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-metrics", 505, 505, "521", 505, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-laws", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 25, 25, "521", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid-metrics", 603, 603, "521", 603, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments", 1405, 1405, "521", 1405, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies-uuid", 2469, 2469, "521", 2469, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["instrument-issuers", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-price-sensitivity", 121, 121, "521", 121, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-coupons", 261, 261, "521", 261, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["markets-uuid", 2494, 2494, "521", 2494, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-params", 3238, 3238, "521", 3238, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["debt-types", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-metrics", 3240, 3240, "521", 3240, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-uuid", 2477, 2477, "521", 2477, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-screener-filter", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid", 604, 604, "521", 604, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, "521", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast", 1808, 1808, "521", 1808, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-payment-summary", 221, 221, "521", 221, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-issue-conditions", 2490, 2490, "521", 2490, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
