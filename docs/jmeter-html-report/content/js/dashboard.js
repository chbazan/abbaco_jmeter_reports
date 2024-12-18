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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "yield-curves"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "appraiser-5-tickers-dinamico"], "isController": false}, {"data": [0.0, 500, 1500, "investments-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "bond-payment-forecast-cashflow"], "isController": false}, {"data": [0.0, 500, 1500, "investments-exchange-rate-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bond-laws"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves-uuid-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "investments"], "isController": false}, {"data": [0.0, 500, 1500, "currencies-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "instrument-issuers"], "isController": false}, {"data": [0.0, 500, 1500, "investments-price-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-coupons"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-params"], "isController": false}, {"data": [0.0, 500, 1500, "markets-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "debt-types"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "bond-screener-filter"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "investments-irr-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bond-payment-forecast"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-payment-summary"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-issue-conditions"], "isController": false}, {"data": [0.0, 500, 1500, "currencies"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 48984, 48984, 100.0, 0.30001633186346344, 0, 184, 0.0, 0.0, 0.0, 0.0, 692.9214055338651, 1502.4232818511998, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["yield-curves", 242, 242, 100.0, 2.6115702479338876, 0, 182, 0.0, 1.0, 1.0, 147.98999999999995, 4.073594020906627, 8.8433917720134, 0.0], "isController": false}, {"data": ["tradable-securities-uuid", 5020, 5020, 100.0, 0.3185258964143424, 0, 170, 0.0, 0.0, 1.0, 1.0, 83.92122772409643, 181.95391254513692, 0.0], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 607, 607, 100.0, 0.899505766062603, 0, 137, 0.0, 1.0, 1.0, 1.919999999999959, 10.321022920492416, 22.381101539651773, 0.0], "isController": false}, {"data": ["investments-metrics", 503, 503, 100.0, 1.3757455268389662, 0, 169, 0.0, 0.0, 1.0, 62.43999999999869, 8.423344218370593, 18.269593067068573, 0.0], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 4021, 4021, 100.0, 0.20368067644864465, 0, 113, 0.0, 0.0, 1.0, 1.0, 67.17789361133387, 145.6516146564254, 0.0], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, 100.0, 0.33333333333333337, 0, 6, 0.0, 1.0, 4.75, 6.0, 0.4092071611253197, 0.8885136935208866, 0.0], "isController": false}, {"data": ["bond-laws", 30, 30, 100.0, 0.03333333333333335, 0, 1, 0.0, 0.0, 0.4499999999999993, 1.0, 0.5226662949928569, 1.1331241942227952, 0.0], "isController": false}, {"data": ["yield-curves-uuid-metrics", 606, 606, 100.0, 1.0099009900990095, 0, 183, 0.0, 1.0, 1.0, 1.0, 10.138696023155042, 21.99687792784126, 0.0], "isController": false}, {"data": ["investments", 1407, 1407, 100.0, 0.7313432835820889, 0, 169, 0.0, 0.0, 1.0, 1.0, 23.51977533348935, 51.002185389572396, 0.0], "isController": false}, {"data": ["currencies-uuid", 2820, 2820, 100.0, 0.20815602836879457, 0, 112, 0.0, 0.0, 0.0, 1.0, 47.06196492047863, 102.04549271123646, 0.0], "isController": false}, {"data": ["instrument-issuers", 31, 31, 100.0, 1.8387096774193552, 0, 56, 0.0, 0.0, 22.999999999999922, 56.0, 0.5252723791449921, 1.1401309686192114, 0.0], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, 100.0, 2.0666666666666664, 0, 171, 0.0, 0.0, 1.0, 149.5799999999992, 2.0219039595619206, 4.386123104465038, 0.0], "isController": false}, {"data": ["bonds-coupons", 260, 260, 100.0, 0.7692307692307692, 0, 115, 0.0, 0.0, 0.0, 35.139999999999645, 4.371290707644715, 9.480860629381798, 0.0], "isController": false}, {"data": ["tradable-securities-params", 5031, 5031, 100.0, 0.3090836811767051, 0, 166, 0.0, 0.0, 1.0, 1.0, 84.0924666120648, 182.33301853678105, 0.0], "isController": false}, {"data": ["markets-uuid", 2818, 2818, 100.0, 0.2909865152590499, 0, 113, 0.0, 0.0, 0.0, 1.0, 46.99564731584477, 101.90362833122092, 0.0], "isController": false}, {"data": ["debt-types", 30, 30, 100.0, 3.8000000000000007, 0, 114, 0.0, 0.0, 51.29999999999992, 114.0, 0.5061241016297195, 1.0986122182575835, 0.0], "isController": false}, {"data": ["tradable-securities-metrics", 8039, 8039, 100.0, 0.21233984326408825, 0, 173, 0.0, 0.0, 1.0, 1.0, 134.3932326930471, 291.3789074907635, 0.0], "isController": false}, {"data": ["bonds-uuid", 12052, 12052, 100.0, 0.10745104546963123, 0, 115, 0.0, 0.0, 0.0, 1.0, 201.5991435549162, 437.08517901500454, 0.0], "isController": false}, {"data": ["bond-screener-filter", 30, 30, 100.0, 3.9666666666666672, 0, 118, 0.0, 0.0, 53.64999999999992, 118.0, 0.5481554568875733, 1.1898470760474338, 0.0], "isController": false}, {"data": ["yield-curves-uuid", 606, 606, 100.0, 0.8778877887788785, 0, 184, 0.0, 1.0, 1.0, 1.0, 10.134965631428427, 21.979573016490225, 0.0], "isController": false}, {"data": ["investments-irr-sensitivity", 21, 21, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.3658982802780827, 0.7932560373216245, 0.0], "isController": false}, {"data": ["bond-payment-forecast", 1803, 1803, 100.0, 0.34830837493067174, 0, 99, 0.0, 0.0, 1.0, 1.0, 30.123300030073178, 65.31707623968323, 0.0], "isController": false}, {"data": ["bonds-payment-summary", 220, 220, 100.0, 0.24999999999999994, 0, 49, 0.0, 0.0, 0.0, 1.0, 3.7287503601633873, 8.085171490737446, 0.0], "isController": false}, {"data": ["bonds-issue-conditions", 2613, 2613, 100.0, 0.2778415614236504, 0, 117, 0.0, 0.0, 0.0, 1.0, 43.70661537174877, 94.76529177469266, 0.0], "isController": false}, {"data": ["currencies", 30, 30, 100.0, 3.833333333333335, 0, 115, 0.0, 0.0, 51.749999999999915, 115.0, 0.5108382856267135, 1.1088450052786623, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar: Name does not resolve", 18, 0.03674669279764821, 0.03674669279764821], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 48966, 99.96325330720235, 99.96325330720235], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 48984, 48984, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 48966, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar: Name does not resolve", 18, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["yield-curves", 242, 242, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 240, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar: Name does not resolve", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-uuid", 5020, 5020, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 5019, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar: Name does not resolve", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 607, 607, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 607, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-metrics", 503, 503, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 503, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 4021, 4021, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 4021, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-laws", 30, 30, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid-metrics", 606, 606, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 603, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar: Name does not resolve", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["investments", 1407, 1407, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 1407, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies-uuid", 2820, 2820, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 2819, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar: Name does not resolve", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["instrument-issuers", 31, 31, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 31, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 120, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-coupons", 260, 260, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 260, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-params", 5031, 5031, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 5028, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar: Name does not resolve", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["markets-uuid", 2818, 2818, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 2816, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar: Name does not resolve", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["debt-types", 30, 30, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-metrics", 8039, 8039, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 8037, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar: Name does not resolve", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-uuid", 12052, 12052, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 12049, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar: Name does not resolve", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["bond-screener-filter", 30, 30, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid", 606, 606, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 605, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar: Name does not resolve", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["investments-irr-sensitivity", 21, 21, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast", 1803, 1803, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 1803, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-payment-summary", 220, 220, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 220, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-issue-conditions", 2613, 2613, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 2613, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies", 30, 30, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.testing.mercap.com.ar", 30, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
