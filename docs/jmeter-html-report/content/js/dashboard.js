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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 16613, 16613, 100.0, 85.29597303316655, 35, 1088, 79.0, 116.0, 122.0, 147.0, 258.0700282722839, 240.7123557259142, 90.97730826401188], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["yield-curves", 241, 241, 100.0, 50.92531120331945, 35, 715, 45.0, 64.0, 73.79999999999995, 126.41999999999922, 4.044302735358282, 3.767017326732673, 0.9597319967695922], "isController": false}, {"data": ["tradable-securities-uuid", 1030, 1030, 100.0, 115.19611650485444, 98, 704, 112.0, 125.0, 130.0, 155.68999999999994, 17.187865033541367, 16.01268517630077, 3.0884444982144643], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 604, 604, 100.0, 47.78476821192057, 35, 146, 45.0, 59.5, 66.0, 90.70000000000027, 10.432139279422433, 9.72823097840167, 11.782254055623682], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1520, 1520, 100.0, 77.87302631578929, 55, 757, 75.0, 92.0, 100.0, 127.0, 25.403616672794733, 23.728490620926227, 13.073931627502757], "isController": false}, {"data": ["investments-metrics", 504, 504, 100.0, 116.25198412698407, 101, 698, 112.0, 127.5, 138.25, 172.74999999999994, 8.41009211053264, 7.835672338055667, 1.2237341059271125], "isController": false}, {"data": ["bond-laws", 30, 30, 100.0, 103.23333333333335, 63, 765, 77.0, 112.00000000000003, 422.34999999999957, 765.0, 0.5123038303249714, 0.47764994492733825, 0.068540649174337], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, 100.0, 113.95833333333331, 101, 134, 113.0, 130.0, 133.5, 134.0, 0.4160815519841889, 0.38760461633813564, 0.07557731315337807], "isController": false}, {"data": ["yield-curves-uuid-metrics", 608, 608, 100.0, 48.60361842105269, 35, 716, 44.0, 60.0, 69.0, 94.63999999999987, 10.171136055673585, 9.473098976194857, 2.542784013918397], "isController": false}, {"data": ["investments", 1031, 1031, 100.0, 115.0756547041707, 98, 716, 112.0, 125.0, 130.39999999999998, 163.03999999999985, 17.19938609368744, 16.040866657838983, 7.390361212131323], "isController": false}, {"data": ["currencies-uuid", 1505, 1505, 100.0, 78.79867109634554, 54, 1088, 76.0, 92.0, 100.0, 131.8800000000001, 25.101322614540422, 23.4189157177227, 5.760557435954101], "isController": false}, {"data": ["instrument-issuers", 31, 31, 100.0, 97.38709677419354, 61, 659, 79.0, 95.4, 326.5999999999992, 659.0, 0.5204136449100187, 0.4859860789349987, 0.07419960171568628], "isController": false}, {"data": ["investments-price-sensitivity", 121, 121, 100.0, 120.2314049586777, 100, 707, 112.0, 128.6, 144.89999999999998, 588.2000000000006, 2.020809325784525, 1.8814122336205887, 0.3571938359052725], "isController": false}, {"data": ["bonds-coupons", 263, 263, 100.0, 81.86692015209128, 55, 755, 76.0, 97.0, 119.79999999999998, 176.36, 4.396963921489952, 4.103508637191962, 0.7643159941652456], "isController": false}, {"data": ["markets-uuid", 1526, 1526, 100.0, 77.68610747051098, 55, 768, 76.0, 91.0, 98.0, 124.46000000000004, 25.448602494830233, 23.7423541364402, 4.2745699503035155], "isController": false}, {"data": ["tradable-securities-params", 1030, 1030, 100.0, 115.18058252427193, 97, 707, 112.0, 126.0, 132.0, 158.06999999999982, 17.19475142733131, 16.021611340188976, 3.341558138709893], "isController": false}, {"data": ["debt-types", 30, 30, 100.0, 102.63333333333333, 61, 768, 77.0, 109.50000000000001, 444.04999999999956, 768.0, 0.5523132720879282, 0.5154923872820664, 0.07443284330872471], "isController": false}, {"data": ["tradable-securities-metrics", 1032, 1032, 100.0, 115.01841085271325, 99, 707, 112.0, 124.70000000000005, 132.3499999999999, 156.02999999999963, 17.223538836409762, 16.045431360359157, 3.22941353182683], "isController": false}, {"data": ["bonds-uuid", 1523, 1523, 100.0, 77.7261982928431, 54, 764, 75.0, 92.0, 98.0, 129.03999999999996, 25.458010163145225, 23.7604525357716, 5.966721131987162], "isController": false}, {"data": ["bond-screener-filter", 30, 30, 100.0, 78.56666666666665, 55, 151, 77.0, 88.9, 122.94999999999996, 151.0, 0.5926628341136727, 0.5542516458740789, 0.41497973833935875], "isController": false}, {"data": ["yield-curves-uuid", 606, 606, 100.0, 48.01320132013198, 35, 715, 44.0, 58.0, 63.0, 94.78999999999985, 10.129205876945193, 9.434331227957276, 2.769704731977201], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, 100.0, 115.04999999999998, 105, 148, 112.5, 124.60000000000001, 146.85, 148.0, 0.39713270189233735, 0.36967469867556246, 0.06825718313774548], "isController": false}, {"data": ["bond-payment-forecast", 1533, 1533, 100.0, 77.28897586431829, 54, 756, 75.0, 90.0, 97.0, 133.98000000000025, 25.597782527384453, 23.906947265103195, 25.19781717539407], "isController": false}, {"data": ["bonds-payment-summary", 222, 222, 100.0, 81.04954954954958, 53, 794, 74.0, 93.70000000000002, 108.39999999999998, 307.7500000000018, 3.707910208444682, 3.459398278828167, 1.0500917582509353], "isController": false}, {"data": ["bonds-issue-conditions", 1519, 1519, 100.0, 77.94930875576037, 55, 766, 75.0, 92.0, 99.0, 133.0, 25.38054102825444, 23.683284573468228, 4.634923019808184], "isController": false}, {"data": ["currencies", 30, 30, 100.0, 86.16666666666664, 58, 314, 72.5, 106.4, 201.24999999999986, 314.0, 0.5109949070840927, 0.4767456065083718, 0.09880565586196324], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["521", 16613, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 16613, 16613, "521", 16613, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["yield-curves", 241, 241, "521", 241, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-uuid", 1030, 1030, "521", 1030, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 604, 604, "521", 604, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1520, 1520, "521", 1520, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-metrics", 504, 504, "521", 504, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-laws", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, "521", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid-metrics", 608, 608, "521", 608, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments", 1031, 1031, "521", 1031, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies-uuid", 1505, 1505, "521", 1505, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["instrument-issuers", 31, 31, "521", 31, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-price-sensitivity", 121, 121, "521", 121, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-coupons", 263, 263, "521", 263, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["markets-uuid", 1526, 1526, "521", 1526, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-params", 1030, 1030, "521", 1030, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["debt-types", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-metrics", 1032, 1032, "521", 1032, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-uuid", 1523, 1523, "521", 1523, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-screener-filter", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid", 606, 606, "521", 606, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, "521", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast", 1533, 1533, "521", 1533, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-payment-summary", 222, 222, "521", 222, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-issue-conditions", 1519, 1519, "521", 1519, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
