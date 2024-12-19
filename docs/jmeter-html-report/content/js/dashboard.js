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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 14454, 14454, 100.0, 106.17213228172179, 78, 987, 107.0, 121.0, 128.0, 154.0, 238.42042755344417, 222.19443503707276, 81.88582234346133], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["yield-curves", 242, 242, 100.0, 120.47933884297527, 99, 987, 113.0, 128.0, 138.85, 225.04999999999956, 4.060266434012282, 3.782692773522701, 0.9635202572900239], "isController": false}, {"data": ["tradable-securities-uuid", 1030, 1030, 100.0, 115.18252427184477, 98, 664, 112.0, 125.0, 133.0, 153.37999999999988, 17.19475142733131, 16.021024444092017, 3.089681897098594], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 504, 504, 100.0, 114.64880952380963, 97, 201, 113.0, 124.0, 129.0, 152.79999999999995, 8.63205850617432, 8.051326038972716, 9.748765510730129], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1215, 1215, 100.0, 97.60246913580256, 79, 709, 94.0, 112.0, 119.0, 142.51999999999975, 20.282113346131375, 18.915838749895666, 10.43815794278441], "isController": false}, {"data": ["investments-metrics", 505, 505, 100.0, 116.6594059405941, 101, 679, 112.0, 125.40000000000003, 136.0, 175.57999999999998, 8.436069626808326, 7.8610002223864885, 1.2275140374945708], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, 100.0, 128.00000000000003, 101, 470, 113.5, 125.5, 384.0, 470.0, 0.4769285799451532, 0.4441319775644847, 0.0866296053416001], "isController": false}, {"data": ["bond-laws", 30, 30, 100.0, 95.80000000000001, 82, 136, 92.5, 108.80000000000001, 134.9, 136.0, 0.5509945451540029, 0.5134903266020167, 0.07371704363876798], "isController": false}, {"data": ["yield-curves-uuid-metrics", 508, 508, 100.0, 117.25787401574796, 100, 987, 113.0, 125.0, 132.0, 156.4599999999998, 8.483633934535737, 7.903078292000668, 2.1209084836339342], "isController": false}, {"data": ["investments", 1027, 1027, 100.0, 115.41577409931843, 97, 668, 113.0, 124.0, 135.0, 159.0, 17.15182791389014, 15.998160812999982, 7.36992605674967], "isController": false}, {"data": ["currencies-uuid", 1210, 1210, 100.0, 98.07520661157021, 80, 708, 95.0, 111.0, 118.0, 139.8900000000001, 20.18112980969695, 18.802993707990726, 4.631411626248812], "isController": false}, {"data": ["instrument-issuers", 30, 30, 100.0, 106.73333333333333, 80, 253, 100.5, 132.8, 200.74999999999994, 253.0, 0.5162978005713696, 0.48160904209548067, 0.0736127723470898], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, 100.0, 120.04166666666663, 102, 665, 114.0, 124.9, 138.79999999999995, 562.5199999999961, 2.0193861066235863, 1.8808819879173397, 0.3569422707996769], "isController": false}, {"data": ["bonds-coupons", 262, 262, 100.0, 101.07251908396941, 79, 712, 95.0, 114.70000000000002, 130.85, 199.29000000000008, 4.386993067881183, 4.0881801827634705, 0.7625827793777837], "isController": false}, {"data": ["markets-uuid", 1215, 1215, 100.0, 97.64609053497936, 78, 699, 94.0, 111.0, 118.0, 141.0, 20.269932099898234, 18.88171806443002, 3.404715157404781], "isController": false}, {"data": ["tradable-securities-params", 1023, 1023, 100.0, 115.99706744868037, 100, 687, 113.0, 125.0, 133.79999999999995, 156.76, 17.075613420130196, 15.907177824027709, 3.318405342388583], "isController": false}, {"data": ["debt-types", 30, 30, 100.0, 107.63333333333333, 83, 419, 94.5, 125.60000000000001, 258.3999999999998, 419.0, 0.5302226935312832, 0.4950988920554967, 0.07145579268292683], "isController": false}, {"data": ["tradable-securities-metrics", 1030, 1030, 100.0, 115.09223300970869, 99, 692, 113.0, 123.0, 132.0, 158.37999999999988, 17.210266007218287, 16.034484626679255, 3.226924876353429], "isController": false}, {"data": ["bonds-uuid", 1217, 1217, 100.0, 97.47165160230075, 79, 705, 94.0, 111.0, 119.0, 153.4599999999998, 20.31889139327156, 18.92742638158444, 4.762240170298021], "isController": false}, {"data": ["bond-screener-filter", 30, 30, 100.0, 96.6, 82, 153, 93.0, 111.50000000000001, 144.75, 153.0, 0.5859489443153186, 0.5462753178773023, 0.41027870417390966], "isController": false}, {"data": ["yield-curves-uuid", 503, 503, 100.0, 118.35984095427435, 100, 982, 114.0, 128.0, 137.0, 180.83999999999992, 8.40406335627882, 7.829713684379804, 2.29798607398249], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, 100.0, 114.44999999999999, 101, 137, 114.5, 132.90000000000003, 136.85, 137.0, 0.3762085700312253, 0.3496461875964035, 0.06466084797411685], "isController": false}, {"data": ["bond-payment-forecast", 1209, 1209, 100.0, 98.07526881720443, 79, 706, 95.0, 111.0, 117.5, 144.60000000000036, 20.182628582875648, 18.822193535799542, 19.867275011268216], "isController": false}, {"data": ["bonds-payment-summary", 221, 221, 100.0, 100.38461538461533, 81, 716, 94.0, 112.0, 124.0, 211.86000000000004, 3.700540848277825, 3.4468056410224213, 1.048004732422431], "isController": false}, {"data": ["bonds-issue-conditions", 1219, 1219, 100.0, 97.28958162428212, 80, 706, 94.0, 111.0, 118.0, 142.0, 20.36044161614137, 18.974698596774733, 3.7181665841976916], "isController": false}, {"data": ["currencies", 30, 30, 100.0, 98.43333333333334, 82, 168, 92.0, 120.10000000000002, 146.54999999999998, 168.0, 0.6754931099702783, 0.6291848909078628, 0.1306129255606593], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["521", 14454, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 14454, 14454, "521", 14454, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["yield-curves", 242, 242, "521", 242, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-uuid", 1030, 1030, "521", 1030, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 504, 504, "521", 504, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1215, 1215, "521", 1215, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-metrics", 505, 505, "521", 505, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, "521", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-laws", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid-metrics", 508, 508, "521", 508, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments", 1027, 1027, "521", 1027, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies-uuid", 1210, 1210, "521", 1210, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["instrument-issuers", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, "521", 120, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-coupons", 262, 262, "521", 262, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["markets-uuid", 1215, 1215, "521", 1215, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-params", 1023, 1023, "521", 1023, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["debt-types", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-metrics", 1030, 1030, "521", 1030, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-uuid", 1217, 1217, "521", 1217, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-screener-filter", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid", 503, 503, "521", 503, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, "521", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast", 1209, 1209, "521", 1209, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-payment-summary", 221, 221, "521", 221, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-issue-conditions", 1219, 1219, "521", 1219, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
