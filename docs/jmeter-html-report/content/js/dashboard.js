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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 27594, 27594, 100.0, 45.20678408349622, 18, 701, 39.0, 48.0, 49.0, 50.0, 441.00302056863404, 410.66651408999377, 135.7385041842467], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["yield-curves", 241, 241, 100.0, 47.65975103734439, 34, 659, 42.0, 55.80000000000001, 70.59999999999991, 114.57999999999998, 4.062573750042143, 3.783854561756178, 0.9640677941994538], "isController": false}, {"data": ["tradable-securities-uuid", 3339, 3339, 100.0, 35.3126684636117, 19, 601, 32.0, 49.0, 55.0, 75.0, 55.78201744127769, 51.89950526141034, 10.023331258979585], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 604, 604, 100.0, 44.19701986754966, 33, 125, 42.0, 54.0, 59.0, 77.0, 10.401598126334642, 9.697900656342565, 11.747121236093891], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 2207, 2207, 100.0, 53.44041685545989, 33, 691, 50.0, 70.0, 79.59999999999991, 117.92000000000007, 36.8644350905325, 34.37420724030367, 18.972223918662724], "isController": false}, {"data": ["investments-metrics", 502, 502, 100.0, 36.964143426294875, 19, 613, 32.0, 53.0, 64.0, 86.96999999999997, 8.417028554182526, 7.831477480885632, 1.224743412669137], "isController": false}, {"data": ["bond-laws", 30, 30, 100.0, 58.00000000000001, 36, 131, 52.0, 102.70000000000007, 118.89999999999998, 131.0, 0.5458018739197671, 0.5079048883380333, 0.07302232102246883], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, 100.0, 35.50000000000001, 23, 59, 33.0, 51.5, 58.0, 59.0, 0.4396570674873599, 0.4087079005459075, 0.07985958452407123], "isController": false}, {"data": ["yield-curves-uuid-metrics", 604, 604, 100.0, 45.5298013245033, 33, 673, 43.0, 54.0, 61.25, 85.85000000000014, 10.099321138347323, 9.408496978773034, 2.5248302845868307], "isController": false}, {"data": ["investments", 1408, 1408, 100.0, 35.607244318181806, 19, 588, 32.0, 49.0, 58.0, 81.0, 23.512908720483615, 21.89812816768812, 10.103202965832805], "isController": false}, {"data": ["currencies-uuid", 2211, 2211, 100.0, 53.37856173677069, 33, 684, 49.0, 69.0, 80.0, 110.0, 36.90535803705558, 34.375961729051916, 8.469491346394593], "isController": false}, {"data": ["instrument-issuers", 30, 30, 100.0, 55.000000000000014, 35, 165, 47.5, 72.0, 121.54999999999994, 165.0, 0.5147210212065061, 0.47968581107164915, 0.07338795810170888], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, 100.0, 40.999999999999986, 20, 602, 32.0, 54.900000000000006, 72.0, 492.79999999999586, 2.067789016594007, 1.9242823048954905, 0.36549786328468287], "isController": false}, {"data": ["bonds-coupons", 261, 261, 100.0, 57.53639846743295, 33, 683, 49.0, 77.0, 89.79999999999995, 185.85999999999933, 4.370468360153385, 4.071329764187277, 0.7597103204172876], "isController": false}, {"data": ["markets-uuid", 2221, 2221, 100.0, 53.1809995497524, 33, 679, 50.0, 69.0, 80.0, 108.5600000000004, 37.07103752169849, 34.53205978142943, 6.226775833722794], "isController": false}, {"data": ["tradable-securities-params", 3303, 3303, 100.0, 35.702089009991, 18, 601, 33.0, 49.0, 56.0, 77.0, 55.16308432286186, 51.324746981311684, 10.720169707274913], "isController": false}, {"data": ["debt-types", 30, 30, 100.0, 74.73333333333335, 38, 701, 51.0, 78.0, 363.84999999999957, 701.0, 0.5556996258289186, 0.5186348949264624, 0.07488920738710036], "isController": false}, {"data": ["tradable-securities-metrics", 3348, 3348, 100.0, 35.22580645161293, 19, 594, 32.0, 48.0, 57.0, 78.50999999999976, 55.950132856498264, 52.046526669479775, 10.490649910593426], "isController": false}, {"data": ["bonds-uuid", 2202, 2202, 100.0, 53.5336058128973, 33, 692, 50.0, 70.0, 79.0, 108.0, 36.82766925341183, 34.307506909369145, 8.631484981268397], "isController": false}, {"data": ["bond-screener-filter", 31, 31, 100.0, 57.03225806451613, 38, 134, 49.0, 80.4, 127.99999999999999, 134.0, 0.5290463512867772, 0.4932477259539901, 0.3704357752662298], "isController": false}, {"data": ["yield-curves-uuid", 608, 608, 100.0, 46.427631578947356, 32, 670, 43.0, 58.0, 65.0, 89.63999999999987, 10.163315112916438, 9.466288180340337, 2.7790314761880883], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, 100.0, 35.150000000000006, 23, 70, 30.5, 61.60000000000003, 69.64999999999999, 70.0, 0.36963793963812447, 0.34418923383296063, 0.06353152087530264], "isController": false}, {"data": ["bond-payment-forecast", 1808, 1808, 100.0, 54.33960176991151, 34, 683, 50.0, 72.0, 82.0, 120.0, 30.217438537262048, 28.178038248123947, 29.745291060117328], "isController": false}, {"data": ["bonds-payment-summary", 221, 221, 100.0, 56.00000000000004, 35, 688, 48.0, 72.0, 82.79999999999995, 204.80000000000007, 3.7088004296167014, 3.454466109996979, 1.0503438716687923], "isController": false}, {"data": ["bonds-issue-conditions", 2191, 2191, 100.0, 53.850296668188086, 32, 691, 50.0, 70.0, 79.40000000000009, 118.0, 36.64614972904261, 34.133397640412795, 6.6922167962216506], "isController": false}, {"data": ["currencies", 30, 30, 100.0, 53.6, 37, 100, 49.0, 78.60000000000001, 88.99999999999999, 100.0, 0.5566069241901369, 0.5190287093213106, 0.10762516698207725], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["521", 27594, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 27594, 27594, "521", 27594, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["yield-curves", 241, 241, "521", 241, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-uuid", 3339, 3339, "521", 3339, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 604, 604, "521", 604, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 2207, 2207, "521", 2207, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-metrics", 502, 502, "521", 502, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-laws", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, "521", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid-metrics", 604, 604, "521", 604, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments", 1408, 1408, "521", 1408, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies-uuid", 2211, 2211, "521", 2211, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["instrument-issuers", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, "521", 120, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-coupons", 261, 261, "521", 261, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["markets-uuid", 2221, 2221, "521", 2221, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-params", 3303, 3303, "521", 3303, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["debt-types", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-metrics", 3348, 3348, "521", 3348, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-uuid", 2202, 2202, "521", 2202, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-screener-filter", 31, 31, "521", 31, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid", 608, 608, "521", 608, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, "521", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast", 1808, 1808, "521", 1808, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-payment-summary", 221, 221, "521", 221, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-issue-conditions", 2191, 2191, "521", 2191, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
