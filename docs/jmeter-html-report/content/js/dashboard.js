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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "tradable-securities-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves"], "isController": false}, {"data": [0.0, 500, 1500, "appraiser-5-tickers-dinamico"], "isController": false}, {"data": [0.0, 500, 1500, "bond-payment-forecast-cashflow"], "isController": false}, {"data": [0.0, 500, 1500, "investments-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "investments-exchange-rate-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bond-laws"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves-uuid-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "investments"], "isController": false}, {"data": [0.0, 500, 1500, "currencies-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "instrument-issuers"], "isController": false}, {"data": [0.0, 500, 1500, "investments-price-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-coupons"], "isController": false}, {"data": [0.0, 500, 1500, "markets-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-params"], "isController": false}, {"data": [0.0, 500, 1500, "debt-types"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "bond-screener-filter"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "investments-irr-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bond-payment-forecast"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-payment-summary"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-issue-conditions"], "isController": false}, {"data": [0.0, 500, 1500, "currencies"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15660, 15660, 100.0, 96.4821200510848, 77, 1930, 92.0, 109.0, 115.0, 144.0, 219.0393599462892, 204.13633923825776, 75.01331514707528], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["tradable-securities-uuid", 1222, 1222, 100.0, 96.96153846153847, 78, 1930, 92.0, 108.0, 114.0, 151.23999999999978, 20.41259500542888, 19.017447459909796, 3.667888165038002], "isController": false}, {"data": ["yield-curves", 243, 243, 100.0, 98.40740740740743, 79, 854, 92.0, 108.0, 113.59999999999997, 190.0400000000002, 4.064088841316564, 3.7869072419805323, 0.9644273324608643], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 603, 603, 100.0, 93.268656716418, 79, 248, 91.0, 106.0, 108.79999999999995, 122.96000000000004, 10.309630870762023, 9.616274668099985, 11.643031301825985], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1233, 1233, 100.0, 96.17437145174355, 78, 881, 93.0, 109.0, 117.0, 143.64000000000033, 20.57812343536166, 19.19125082925832, 10.590499072691012], "isController": false}, {"data": ["investments-metrics", 503, 503, 100.0, 96.74155069582514, 79, 656, 93.0, 110.60000000000002, 116.0, 155.83999999999992, 8.40982427981475, 7.834215539365669, 1.2236951344652323], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 25, 25, 100.0, 97.84, 83, 136, 95.0, 119.40000000000005, 134.8, 136.0, 0.4291624465692754, 0.39955694341922304, 0.07795333502137229], "isController": false}, {"data": ["bond-laws", 30, 30, 100.0, 95.4, 80, 116, 94.5, 108.9, 116.0, 116.0, 0.5761253648793978, 0.5368730735808112, 0.07707927244968504], "isController": false}, {"data": ["yield-curves-uuid-metrics", 595, 595, 100.0, 95.16134453781514, 79, 848, 91.0, 107.0, 112.0, 126.15999999999985, 9.943347983756412, 9.266401301826567, 2.485836995939103], "isController": false}, {"data": ["investments", 1242, 1242, 100.0, 95.28341384863131, 78, 664, 92.0, 108.0, 113.0, 141.84999999999968, 20.75430710358772, 19.356280444245776, 8.917866333572848], "isController": false}, {"data": ["currencies-uuid", 1234, 1234, 100.0, 96.20016207455426, 78, 883, 93.0, 110.0, 116.0, 146.6500000000001, 20.554676438744067, 19.15062892999917, 4.717137659282086], "isController": false}, {"data": ["instrument-issuers", 31, 31, 100.0, 124.4193548387097, 81, 719, 93.0, 206.80000000000007, 424.3999999999993, 719.0, 0.5203350286184265, 0.4852242161404569, 0.0741883927522366], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, 100.0, 99.92499999999998, 79, 660, 92.0, 108.0, 118.74999999999994, 558.5699999999962, 2.042379371968343, 1.9020488947749128, 0.3610065100842481], "isController": false}, {"data": ["bonds-coupons", 262, 262, 100.0, 99.07633587786256, 78, 882, 93.0, 111.40000000000003, 119.69999999999999, 175.22000000000003, 4.383469968211477, 4.086269501840388, 0.7619703655680107], "isController": false}, {"data": ["markets-uuid", 1225, 1225, 100.0, 96.8612244897959, 77, 879, 93.0, 110.0, 119.0, 148.22000000000003, 20.42415552369202, 19.027842761095734, 3.430619873120144], "isController": false}, {"data": ["tradable-securities-params", 1247, 1247, 100.0, 94.96391339214111, 78, 669, 92.0, 108.0, 113.0, 135.0, 20.826026688043825, 19.40491679818628, 4.0472454208210165], "isController": false}, {"data": ["debt-types", 31, 31, 100.0, 129.48387096774195, 80, 882, 96.0, 199.40000000000003, 482.99999999999903, 882.0, 0.5198028102887421, 0.484007417669942, 0.07005155060531876], "isController": false}, {"data": ["tradable-securities-metrics", 1237, 1237, 100.0, 96.02101859337105, 77, 1103, 91.0, 109.0, 115.0, 141.0, 20.541689499991694, 19.141023934514024, 3.8515667812484433], "isController": false}, {"data": ["bonds-uuid", 1234, 1234, 100.0, 96.08995137763351, 78, 882, 93.0, 108.0, 114.25, 136.0, 20.608226590290418, 19.199526336445164, 4.830053107099317], "isController": false}, {"data": ["bond-screener-filter", 30, 30, 100.0, 113.56666666666668, 79, 555, 92.0, 143.70000000000005, 333.3499999999997, 555.0, 0.5228758169934641, 0.4874217047930283, 0.36611519607843135], "isController": false}, {"data": ["yield-curves-uuid", 594, 594, 100.0, 95.94612794612796, 80, 858, 92.0, 106.0, 110.0, 134.04999999999995, 9.926968263783278, 9.249819431330113, 2.71440538462824], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, 100.0, 109.84999999999998, 80, 423, 93.5, 123.10000000000004, 408.0999999999998, 423.0, 0.37028122859311646, 0.3452583174420973, 0.06364208616444189], "isController": false}, {"data": ["bond-payment-forecast", 1217, 1217, 100.0, 97.48069022185702, 77, 1112, 93.0, 110.0, 118.0, 147.27999999999975, 20.301943448160813, 18.93221455605138, 19.9847255817833], "isController": false}, {"data": ["bonds-payment-summary", 223, 223, 100.0, 101.86995515695068, 79, 881, 93.0, 116.79999999999998, 134.39999999999995, 238.2799999999993, 3.7279125361507215, 3.474315487136194, 1.0557564799645598], "isController": false}, {"data": ["bonds-issue-conditions", 1229, 1229, 100.0, 96.5012205044752, 77, 879, 93.0, 110.0, 117.0, 140.4000000000001, 20.51752921535893, 19.114018155258766, 3.74685347975793], "isController": false}, {"data": ["currencies", 30, 30, 100.0, 108.2666666666667, 83, 373, 94.0, 126.80000000000003, 277.29999999999984, 373.0, 0.5311896878375267, 0.49496434942542983, 0.10271050604670928], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["521", 15660, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15660, 15660, "521", 15660, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["tradable-securities-uuid", 1222, 1222, "521", 1222, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves", 243, 243, "521", 243, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 603, 603, "521", 603, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1233, 1233, "521", 1233, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-metrics", 503, 503, "521", 503, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 25, 25, "521", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-laws", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid-metrics", 595, 595, "521", 595, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments", 1242, 1242, "521", 1242, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies-uuid", 1234, 1234, "521", 1234, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["instrument-issuers", 31, 31, "521", 31, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, "521", 120, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-coupons", 262, 262, "521", 262, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["markets-uuid", 1225, 1225, "521", 1225, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-params", 1247, 1247, "521", 1247, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["debt-types", 31, 31, "521", 31, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-metrics", 1237, 1237, "521", 1237, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-uuid", 1234, 1234, "521", 1234, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-screener-filter", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid", 594, 594, "521", 594, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, "521", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast", 1217, 1217, "521", 1217, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-payment-summary", 223, 223, "521", 223, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-issue-conditions", 1229, 1229, "521", 1229, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
