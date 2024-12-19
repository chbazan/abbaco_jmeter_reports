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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "yield-curves"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "appraiser-5-tickers-dinamico"], "isController": false}, {"data": [0.0, 500, 1500, "bond-payment-forecast-cashflow"], "isController": false}, {"data": [0.0, 500, 1500, "investments-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "investments-exchange-rate-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bond-laws"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves-uuid-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "investments"], "isController": false}, {"data": [0.0, 500, 1500, "currencies-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "instrument-issuers"], "isController": false}, {"data": [0.0, 500, 1500, "investments-price-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-coupons"], "isController": false}, {"data": [0.0, 500, 1500, "markets-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-params"], "isController": false}, {"data": [0.0, 500, 1500, "debt-types"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "bond-screener-filter"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "investments-irr-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bond-payment-forecast"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-payment-summary"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-issue-conditions"], "isController": false}, {"data": [0.0, 500, 1500, "currencies"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13679, 13679, 100.0, 105.18480883105495, 33, 1484, 110.0, 123.0, 130.0, 164.0, 222.90118628601223, 207.73448702907052, 76.70732303480641], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["yield-curves", 243, 243, 100.0, 50.378600823045254, 34, 753, 44.0, 61.599999999999994, 68.59999999999997, 102.60000000000002, 4.062254467644059, 3.7862754465554422, 0.9639920269897524], "isController": false}, {"data": ["tradable-securities-uuid", 1037, 1037, 100.0, 114.36451301832221, 98, 744, 112.0, 123.0, 130.0999999999999, 148.23999999999978, 17.3182584879507, 16.13594251010371, 3.1118745720536416], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 602, 602, 100.0, 46.60465116279074, 34, 129, 44.0, 58.700000000000045, 65.85000000000002, 89.94000000000005, 10.33174867420667, 9.63373953631558, 11.668318768556816], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1030, 1030, 100.0, 115.19029126213603, 98, 777, 112.0, 125.0, 135.0, 173.13999999999965, 17.184137206159594, 16.027948727039156, 8.84378936293565], "isController": false}, {"data": ["investments-metrics", 503, 503, 100.0, 115.80318091451292, 99, 749, 112.0, 125.0, 134.79999999999995, 169.87999999999994, 8.396627994324348, 7.824547069318087, 1.221774971830398], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, 100.0, 143.70833333333334, 106, 749, 112.5, 171.0, 608.75, 749.0, 0.4438444325263995, 0.4130520026168328, 0.08062018012686553], "isController": false}, {"data": ["bond-laws", 30, 30, 100.0, 111.00000000000001, 103, 125, 109.0, 120.80000000000001, 124.45, 125.0, 0.5794861889124976, 0.5401935544234112, 0.07752891394630095], "isController": false}, {"data": ["yield-curves-uuid-metrics", 603, 603, 100.0, 48.51741293532338, 34, 759, 45.0, 59.60000000000002, 67.0, 85.96000000000004, 10.074514652320646, 9.383755027859458, 2.518628663080162], "isController": false}, {"data": ["investments", 1038, 1038, 100.0, 114.1724470134875, 98, 752, 112.0, 123.0, 129.0, 152.2199999999998, 17.3285921770922, 16.163958943715464, 7.445879451094306], "isController": false}, {"data": ["currencies-uuid", 1027, 1027, 100.0, 115.59298928919178, 99, 771, 112.0, 125.0, 134.5999999999999, 177.0400000000002, 17.109252657181887, 15.941659655815812, 3.926439818786859], "isController": false}, {"data": ["instrument-issuers", 30, 30, 100.0, 110.5, 103, 129, 110.0, 119.9, 125.14999999999999, 129.0, 0.5434585703416542, 0.5053704745751966, 0.07748530397449369], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, 100.0, 118.65833333333332, 101, 665, 113.0, 122.9, 125.0, 562.099999999996, 2.0169084155503643, 1.8805110446745215, 0.3565043195455233], "isController": false}, {"data": ["bonds-coupons", 264, 264, 100.0, 117.51893939393939, 100, 770, 112.0, 126.0, 135.75, 195.0, 4.413756206844666, 4.112214187342216, 0.7672349656429204], "isController": false}, {"data": ["markets-uuid", 1034, 1034, 100.0, 114.78336557059957, 98, 770, 112.0, 125.0, 133.25, 172.6500000000001, 17.21611721611722, 16.039250463078588, 2.8917696886446884], "isController": false}, {"data": ["tradable-securities-params", 1035, 1035, 100.0, 114.47342995169086, 97, 751, 112.0, 124.39999999999998, 130.0, 156.2000000000005, 17.29265521619996, 16.112334905266323, 3.3605843633044845], "isController": false}, {"data": ["debt-types", 30, 30, 100.0, 132.23333333333335, 102, 644, 112.0, 133.20000000000002, 376.14999999999964, 644.0, 0.52997915415327, 0.493922629668233, 0.07142297194643678], "isController": false}, {"data": ["tradable-securities-metrics", 1039, 1039, 100.0, 114.14340712223282, 98, 746, 112.0, 123.0, 129.0, 159.39999999999964, 17.357166722352154, 16.171522615268962, 3.254468760441029], "isController": false}, {"data": ["bonds-uuid", 1037, 1037, 100.0, 114.2642237222758, 98, 785, 111.0, 123.0, 132.0, 166.6199999999999, 17.317101681612478, 16.132940353480954, 4.058695706627924], "isController": false}, {"data": ["bond-screener-filter", 31, 31, 100.0, 117.0967741935484, 101, 215, 111.0, 128.0, 181.39999999999992, 215.0, 0.6047954425736973, 0.5642903042511267, 0.4234749339114658], "isController": false}, {"data": ["yield-curves-uuid", 605, 605, 100.0, 48.82314049586778, 33, 752, 45.0, 62.0, 68.0, 87.0, 10.112321989703817, 9.422290514056963, 2.7650880440596377], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, 100.0, 118.00000000000001, 102, 220, 113.5, 129.90000000000003, 215.54999999999995, 220.0, 0.3609782510603736, 0.3361433704088079, 0.062043136901001716], "isController": false}, {"data": ["bond-payment-forecast", 1021, 1021, 100.0, 116.21057786483837, 97, 1484, 112.0, 124.0, 133.0, 161.33999999999992, 17.029154713456535, 15.878408489142037, 16.763074171058776], "isController": false}, {"data": ["bonds-payment-summary", 222, 222, 100.0, 118.05405405405408, 101, 773, 111.0, 125.70000000000002, 141.0, 201.54000000000002, 3.704939919893191, 3.452096284629506, 1.0492505632510014], "isController": false}, {"data": ["bonds-issue-conditions", 1024, 1024, 100.0, 115.80468750000006, 99, 776, 112.0, 127.0, 136.75, 190.75, 17.106296252986084, 15.938372463916407, 3.1239037102621072], "isController": false}, {"data": ["currencies", 30, 30, 100.0, 133.46666666666667, 102, 770, 113.0, 119.80000000000001, 412.49999999999955, 770.0, 0.5094070501935747, 0.4752475930516878, 0.09849862884602323], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["521", 13679, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 13679, 13679, "521", 13679, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["yield-curves", 243, 243, "521", 243, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-uuid", 1037, 1037, "521", 1037, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 602, 602, "521", 602, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1030, 1030, "521", 1030, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-metrics", 503, 503, "521", 503, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, "521", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-laws", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid-metrics", 603, 603, "521", 603, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments", 1038, 1038, "521", 1038, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies-uuid", 1027, 1027, "521", 1027, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["instrument-issuers", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, "521", 120, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-coupons", 264, 264, "521", 264, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["markets-uuid", 1034, 1034, "521", 1034, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-params", 1035, 1035, "521", 1035, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["debt-types", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-metrics", 1039, 1039, "521", 1039, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-uuid", 1037, 1037, "521", 1037, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-screener-filter", 31, 31, "521", 31, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid", 605, 605, "521", 605, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, "521", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast", 1021, 1021, "521", 1021, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-payment-summary", 222, 222, "521", 222, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-issue-conditions", 1024, 1024, "521", 1024, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
