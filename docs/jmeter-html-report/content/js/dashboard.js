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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22024, 22024, 100.0, 63.59071921540113, 20, 1142, 43.0, 96.0, 100.0, 103.0, 333.76776892068017, 311.01563565566937, 100.04590225578153], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["yield-curves", 244, 244, 100.0, 97.56967213114754, 79, 822, 92.0, 107.0, 113.0, 148.25000000000017, 4.077676392927572, 3.7982435388047726, 0.9676517221498044], "isController": false}, {"data": ["tradable-securities-uuid", 3297, 3297, 100.0, 35.7306642402184, 21, 693, 33.0, 48.0, 55.0, 78.01999999999998, 55.10705510705511, 51.33541726733691, 9.902048964548964], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 604, 604, 100.0, 94.49006622516546, 79, 204, 93.0, 107.0, 110.75, 122.95000000000005, 10.349199821801857, 9.649699826085467, 11.688480277192351], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1232, 1232, 100.0, 96.28571428571409, 79, 748, 93.0, 109.70000000000005, 116.0, 141.34000000000015, 20.56280668958841, 19.177080247312816, 10.582616333411222], "isController": false}, {"data": ["investments-metrics", 504, 504, 100.0, 36.7599206349206, 22, 638, 32.0, 50.0, 57.0, 93.74999999999994, 8.430067239822032, 7.85186566462048, 1.2266406432944168], "isController": false}, {"data": ["bond-laws", 32, 32, 100.0, 115.09375, 81, 745, 93.0, 112.7, 336.14999999999867, 745.0, 0.5343129069961596, 0.49827678869594255, 0.0714852229086659], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 25, 25, 100.0, 59.44, 26, 683, 34.0, 43.400000000000006, 491.29999999999956, 683.0, 0.4180462191899937, 0.38994240890772885, 0.07593417653255743], "isController": false}, {"data": ["yield-curves-uuid-metrics", 597, 597, 100.0, 95.48241206030147, 79, 791, 92.0, 106.20000000000005, 111.10000000000002, 137.07999999999993, 9.976604278074866, 9.29674770742814, 2.4941510695187166], "isController": false}, {"data": ["investments", 1406, 1406, 100.0, 36.383357041251855, 21, 687, 32.0, 50.0, 59.0, 86.0, 23.514851485148515, 21.929913674697282, 10.104037747524751], "isController": false}, {"data": ["currencies-uuid", 1233, 1233, 100.0, 96.26277372262777, 78, 765, 93.0, 109.0, 115.0, 134.0, 20.555481461723126, 19.15315438283542, 4.717322405766538], "isController": false}, {"data": ["instrument-issuers", 30, 30, 100.0, 94.43333333333332, 81, 112, 93.0, 106.0, 108.69999999999999, 112.0, 0.5544466622310934, 0.5170142931729135, 0.07905196551341762], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, 100.0, 40.68333333333333, 21, 685, 32.5, 48.0, 61.0, 558.9999999999952, 2.028569013608317, 1.8888407573324317, 0.35856542135068886], "isController": false}, {"data": ["bonds-coupons", 262, 262, 100.0, 98.25954198473283, 79, 458, 94.0, 109.0, 115.0, 196.0, 4.392656551261631, 4.091607767834688, 0.7635672520747757], "isController": false}, {"data": ["markets-uuid", 1236, 1236, 100.0, 96.0744336569579, 79, 751, 93.0, 109.0, 114.0, 138.66999999999894, 20.590391150796297, 19.18754646269241, 3.4585422636103154], "isController": false}, {"data": ["tradable-securities-params", 3306, 3306, 100.0, 35.646702964307245, 21, 692, 33.0, 48.0, 55.0, 76.0, 55.236249415224215, 51.455194296974206, 10.734388314091426], "isController": false}, {"data": ["debt-types", 30, 30, 100.0, 119.53333333333332, 82, 687, 92.0, 165.60000000000008, 409.7999999999996, 687.0, 0.5389770216129786, 0.5023960616499883, 0.07263557517831157], "isController": false}, {"data": ["tradable-securities-metrics", 3304, 3304, 100.0, 35.68916464891039, 20, 689, 33.0, 47.0, 55.0, 74.94999999999982, 55.228670767584916, 51.45231024024639, 10.355375768922173], "isController": false}, {"data": ["bonds-uuid", 1229, 1229, 100.0, 96.45972335231893, 78, 749, 93.0, 109.0, 116.5, 151.4000000000001, 20.523696603319863, 19.120415984770048, 4.810241391403093], "isController": false}, {"data": ["bond-screener-filter", 30, 30, 100.0, 96.56666666666665, 82, 115, 94.5, 110.9, 112.8, 115.0, 0.5347402944636556, 0.498412071984956, 0.3744226475883213], "isController": false}, {"data": ["yield-curves-uuid", 591, 591, 100.0, 95.26903553299493, 79, 800, 91.0, 107.0, 114.0, 130.24000000000012, 9.868585836659042, 9.19457882658173, 2.6984414397114564], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, 100.0, 60.800000000000004, 27, 487, 34.5, 84.30000000000005, 466.9999999999997, 487.0, 0.3654236173283879, 0.34044348723758017, 0.06280718422831667], "isController": false}, {"data": ["bond-payment-forecast", 1227, 1227, 100.0, 96.70741646291766, 78, 757, 93.0, 109.0, 116.59999999999991, 146.8800000000001, 20.462618614812467, 19.085255569059253, 20.14289019895602], "isController": false}, {"data": ["bonds-payment-summary", 220, 220, 100.0, 99.28181818181812, 78, 750, 93.0, 109.0, 116.89999999999998, 202.27999999999975, 3.705075954057058, 3.45196374288457, 1.0492890885513153], "isController": false}, {"data": ["bonds-issue-conditions", 1214, 1214, 100.0, 97.73146622734775, 78, 1142, 93.0, 109.0, 118.25, 149.8499999999999, 20.263052476966216, 18.878974970581854, 3.700381653508479], "isController": false}, {"data": ["currencies", 31, 31, 100.0, 96.6774193548387, 80, 133, 91.0, 119.0, 126.99999999999999, 133.0, 0.5507684107666341, 0.514020442835569, 0.10649623567557964], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["521", 22024, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22024, 22024, "521", 22024, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["yield-curves", 244, 244, "521", 244, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-uuid", 3297, 3297, "521", 3297, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 604, 604, "521", 604, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1232, 1232, "521", 1232, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-metrics", 504, 504, "521", 504, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-laws", 32, 32, "521", 32, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 25, 25, "521", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid-metrics", 597, 597, "521", 597, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments", 1406, 1406, "521", 1406, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies-uuid", 1233, 1233, "521", 1233, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["instrument-issuers", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, "521", 120, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-coupons", 262, 262, "521", 262, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["markets-uuid", 1236, 1236, "521", 1236, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-params", 3306, 3306, "521", 3306, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["debt-types", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-metrics", 3304, 3304, "521", 3304, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-uuid", 1229, 1229, "521", 1229, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-screener-filter", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid", 591, 591, "521", 591, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, "521", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast", 1227, 1227, "521", 1227, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-payment-summary", 220, 220, "521", 220, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-issue-conditions", 1214, 1214, "521", 1214, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies", 31, 31, "521", 31, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
