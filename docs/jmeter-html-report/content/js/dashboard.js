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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 20565, 20565, 100.0, 66.91932895696549, 19, 791, 46.0, 115.0, 119.0, 125.0, 318.2155788691858, 296.2645011053987, 94.19362829008448], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["yield-curves", 243, 243, 100.0, 78.1646090534979, 54, 791, 74.0, 88.0, 93.0, 110.80000000000001, 4.067354043920728, 3.7948207926737414, 0.9652021803444697], "isController": false}, {"data": ["tradable-securities-uuid", 3233, 3233, 100.0, 36.35539746365605, 20, 592, 33.0, 49.0, 57.0, 82.0, 54.0418561112597, 50.25410148414516, 9.710646019991977], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 605, 605, 100.0, 74.40165289256187, 55, 178, 73.0, 86.0, 92.0, 109.0, 10.411288934778868, 9.720855382034074, 11.757570502065049], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1028, 1028, 100.0, 115.43774319066137, 99, 740, 113.0, 124.0, 132.0, 165.97000000000025, 17.15649460104474, 16.000816597197886, 8.829563139404863], "isController": false}, {"data": ["investments-metrics", 503, 503, 100.0, 38.425447316103366, 21, 617, 31.0, 52.60000000000002, 65.0, 219.79999999999785, 8.415452309648492, 7.827890772699135, 1.2245140567750246], "isController": false}, {"data": ["bond-laws", 30, 30, 100.0, 118.13333333333335, 103, 245, 113.0, 127.50000000000001, 185.5999999999999, 245.0, 0.5455338958393948, 0.5082060231488217, 0.07298646848632528], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, 100.0, 35.54166666666666, 22, 70, 32.5, 56.0, 66.5, 70.0, 0.4289160932892503, 0.3985310461531588, 0.07790858725761773], "isController": false}, {"data": ["yield-curves-uuid-metrics", 602, 602, 100.0, 76.68272425249175, 55, 789, 74.0, 89.0, 93.85000000000002, 109.0, 10.058479532163743, 9.384284278404344, 2.5146198830409356], "isController": false}, {"data": ["investments", 1404, 1404, 100.0, 37.561253561253594, 20, 591, 33.0, 54.0, 65.0, 97.95000000000005, 23.464527450488845, 21.844332983412716, 10.082414138881925], "isController": false}, {"data": ["currencies-uuid", 1023, 1023, 100.0, 116.01075268817206, 98, 743, 113.0, 126.0, 135.79999999999995, 172.27999999999997, 17.056253959785256, 15.890917815699089, 3.914277031786655], "isController": false}, {"data": ["instrument-issuers", 30, 30, 100.0, 140.16666666666669, 100, 740, 112.0, 177.00000000000009, 433.64999999999964, 740.0, 0.5160224985809382, 0.4808315111288852, 0.07357352030548532], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, 100.0, 43.59166666666667, 22, 551, 34.0, 55.60000000000002, 74.49999999999989, 502.27999999999815, 2.0354852936187533, 1.893889197509923, 0.3597879278759711], "isController": false}, {"data": ["bonds-coupons", 262, 262, 100.0, 118.60687022900758, 99, 741, 112.0, 130.0, 154.0, 225.12000000000035, 4.387801242652108, 4.089064148565591, 0.7627232628828859], "isController": false}, {"data": ["markets-uuid", 1028, 1028, 100.0, 115.49999999999984, 100, 743, 112.0, 125.0, 131.0, 170.26000000000022, 17.12990735186296, 15.958282952784444, 2.8772891255082316], "isController": false}, {"data": ["tradable-securities-params", 3200, 3200, 100.0, 36.675, 19, 585, 33.0, 50.0, 58.0, 88.0, 53.48666176372267, 49.737747558626396, 10.39438055759845], "isController": false}, {"data": ["debt-types", 30, 30, 100.0, 115.09999999999998, 103, 183, 112.0, 129.4, 157.69999999999996, 183.0, 0.510282186048885, 0.47531656099573066, 0.06876849772924427], "isController": false}, {"data": ["tradable-securities-metrics", 3226, 3226, 100.0, 36.43645381277118, 20, 605, 33.0, 49.0, 57.0, 82.0, 53.92304349279577, 50.14636847900578, 10.110570654899208], "isController": false}, {"data": ["bonds-uuid", 1024, 1024, 100.0, 115.78320312500003, 99, 753, 112.0, 127.0, 133.0, 171.75, 17.10715359684587, 15.941422695170237, 4.00948912426075], "isController": false}, {"data": ["bond-screener-filter", 33, 33, 100.0, 119.27272727272728, 102, 385, 110.0, 130.2, 210.6999999999993, 385.0, 0.5541933967017096, 0.5163910831542001, 0.38804361858899], "isController": false}, {"data": ["yield-curves-uuid", 607, 607, 100.0, 76.31795716639198, 55, 786, 74.0, 89.0, 94.0, 105.91999999999996, 10.14897423464696, 9.467442713471216, 2.775110142286278], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, 100.0, 65.15000000000002, 25, 592, 33.5, 97.10000000000011, 567.4999999999997, 592.0, 0.34404458817862793, 0.3197699578115324, 0.059132663593201684], "isController": false}, {"data": ["bond-payment-forecast", 1021, 1021, 100.0, 116.16846229187067, 101, 739, 113.0, 125.80000000000007, 136.0, 178.23999999999978, 17.047921188846217, 15.903162960218735, 16.781547420270496], "isController": false}, {"data": ["bonds-payment-summary", 221, 221, 100.0, 119.66063348416287, 101, 741, 113.0, 129.8, 165.89999999999952, 193.78, 3.707120691101233, 3.454375864924935, 1.049868164472029], "isController": false}, {"data": ["bonds-issue-conditions", 1018, 1018, 100.0, 116.41060903732797, 100, 741, 113.0, 126.0, 132.04999999999995, 177.6199999999999, 17.025404311541486, 15.861737969954676, 3.10913145142408], "isController": false}, {"data": ["currencies", 30, 30, 100.0, 113.06666666666668, 102, 136, 112.0, 122.0, 130.5, 136.0, 0.5562560261069495, 0.5180677461896462, 0.10755731754802343], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["521", 20565, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 20565, 20565, "521", 20565, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["yield-curves", 243, 243, "521", 243, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-uuid", 3233, 3233, "521", 3233, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 605, 605, "521", 605, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1028, 1028, "521", 1028, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-metrics", 503, 503, "521", 503, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-laws", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, "521", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid-metrics", 602, 602, "521", 602, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments", 1404, 1404, "521", 1404, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies-uuid", 1023, 1023, "521", 1023, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["instrument-issuers", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, "521", 120, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-coupons", 262, 262, "521", 262, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["markets-uuid", 1028, 1028, "521", 1028, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-params", 3200, 3200, "521", 3200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["debt-types", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-metrics", 3226, 3226, "521", 3226, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-uuid", 1024, 1024, "521", 1024, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-screener-filter", 33, 33, "521", 33, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid", 607, 607, "521", 607, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, "521", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast", 1021, 1021, "521", 1021, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-payment-summary", 221, 221, "521", 221, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-issue-conditions", 1018, 1018, "521", 1018, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
