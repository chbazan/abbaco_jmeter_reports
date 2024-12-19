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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "yield-curves"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "appraiser-5-tickers-dinamico"], "isController": false}, {"data": [0.0, 500, 1500, "bond-payment-forecast-cashflow"], "isController": false}, {"data": [0.0, 500, 1500, "investments-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "bond-laws"], "isController": false}, {"data": [0.0, 500, 1500, "investments-exchange-rate-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves-uuid-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "investments"], "isController": false}, {"data": [0.0, 500, 1500, "instrument-issuers"], "isController": false}, {"data": [0.0, 500, 1500, "currencies-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "investments-price-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-coupons"], "isController": false}, {"data": [0.0, 500, 1500, "markets-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-params"], "isController": false}, {"data": [0.0, 500, 1500, "debt-types"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "bond-screener-filter"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "investments-irr-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bond-payment-forecast"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-payment-summary"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-issue-conditions"], "isController": false}, {"data": [0.0, 500, 1500, "currencies"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15594, 15594, 100.0, 97.11433884827481, 77, 828, 93.0, 109.0, 116.0, 156.0, 221.30449591280654, 206.2371693125213, 75.53437360301005], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["yield-curves", 243, 243, 100.0, 99.89300411522632, 81, 802, 95.0, 111.0, 116.0, 145.08000000000004, 4.0573708904509855, 3.7808431410812977, 0.962833131230068], "isController": false}, {"data": ["tradable-securities-uuid", 1252, 1252, 100.0, 94.68130990415327, 77, 669, 92.0, 107.0, 111.0, 136.47000000000003, 20.91616826489358, 19.48711886360219, 3.7583739850980655], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 592, 592, 100.0, 97.02364864864873, 80, 182, 95.0, 110.0, 114.35000000000002, 129.2800000000002, 10.145846544071022, 9.460433528209567, 11.457726353493634], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1199, 1199, 100.0, 98.76897414512086, 78, 817, 94.0, 112.0, 122.0, 177.0, 20.02304570731952, 18.675695728820493, 10.304829187263072], "isController": false}, {"data": ["investments-metrics", 507, 507, 100.0, 94.72781065088752, 78, 661, 90.0, 106.0, 110.0, 156.64000000000027, 8.46481342349111, 7.88577275857751, 1.2316964844728273], "isController": false}, {"data": ["bond-laws", 30, 30, 100.0, 101.5, 82, 205, 94.0, 122.9, 161.54999999999995, 205.0, 0.5266206751277055, 0.4899697961100286, 0.07045608641845279], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 25, 25, 100.0, 96.84000000000002, 78, 137, 99.0, 115.4, 130.7, 137.0, 0.42442659966385415, 0.3951643751167173, 0.07709311282956725], "isController": false}, {"data": ["yield-curves-uuid-metrics", 600, 600, 100.0, 97.88833333333338, 79, 799, 94.0, 108.89999999999998, 114.0, 132.0, 10.02590024229259, 9.341368195964575, 2.5064750605731474], "isController": false}, {"data": ["investments", 1257, 1257, 100.0, 94.321400159109, 77, 661, 92.0, 106.0, 109.09999999999991, 130.0, 20.98707716966641, 19.57465350243764, 9.017884721341035], "isController": false}, {"data": ["instrument-issuers", 30, 30, 100.0, 125.33333333333334, 80, 827, 91.0, 154.10000000000005, 474.99999999999955, 827.0, 0.5052801778586226, 0.4711178429168141, 0.07204190035874893], "isController": false}, {"data": ["currencies-uuid", 1200, 1200, 100.0, 98.75583333333326, 79, 820, 94.0, 112.0, 122.0, 170.92000000000007, 20.029042111061038, 18.662379460634586, 4.596508687597016], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, 100.0, 99.46666666666665, 79, 661, 90.5, 110.80000000000001, 113.94999999999999, 563.5599999999963, 2.0152487152789442, 1.877011968688073, 0.3562109545561415], "isController": false}, {"data": ["bonds-coupons", 260, 260, 100.0, 102.99615384615382, 80, 818, 95.0, 115.0, 152.74999999999994, 202.55999999999995, 4.367472409332953, 4.069308427541953, 0.7591895399035796], "isController": false}, {"data": ["markets-uuid", 1203, 1203, 100.0, 98.61512884455519, 78, 828, 94.0, 112.0, 121.0, 180.96000000000004, 20.06237179594083, 18.691995480546336, 3.3698515125994364], "isController": false}, {"data": ["tradable-securities-params", 1264, 1264, 100.0, 93.8180379746836, 78, 660, 91.0, 105.0, 109.0, 129.04999999999973, 21.09972289920876, 19.654473649342304, 4.100434430607953], "isController": false}, {"data": ["debt-types", 30, 30, 100.0, 108.26666666666667, 82, 468, 95.0, 109.0, 274.39999999999975, 468.0, 0.5455537370430987, 0.5081357121749409, 0.07352189034369885], "isController": false}, {"data": ["tradable-securities-metrics", 1258, 1258, 100.0, 94.25039745627976, 77, 660, 91.0, 107.0, 111.0, 129.23000000000025, 21.016756603237717, 19.577323349817064, 3.940641863107072], "isController": false}, {"data": ["bonds-uuid", 1213, 1213, 100.0, 97.61005770816159, 78, 822, 93.0, 110.0, 118.0, 174.8599999999999, 20.282245928502157, 18.89547035414507, 4.753651389492693], "isController": false}, {"data": ["bond-screener-filter", 30, 30, 100.0, 98.43333333333334, 83, 125, 96.5, 110.9, 117.29999999999998, 125.0, 0.6025185274447189, 0.5620368138820269, 0.42188064861119484], "isController": false}, {"data": ["yield-curves-uuid", 595, 595, 100.0, 98.50420168067228, 80, 793, 95.0, 110.0, 116.19999999999993, 142.0, 9.94251721141635, 9.261498515933093, 2.718657049996658], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, 100.0, 94.64999999999998, 82, 111, 94.0, 108.7, 110.9, 111.0, 0.37498125093745316, 0.3491646706727164, 0.06444990250487476], "isController": false}, {"data": ["bond-payment-forecast", 1206, 1206, 100.0, 98.25870646766164, 78, 818, 94.0, 112.0, 120.0, 170.0, 20.13893527486474, 18.78119964222497, 19.824264411194978], "isController": false}, {"data": ["bonds-payment-summary", 224, 224, 100.0, 101.88839285714288, 80, 808, 93.0, 109.5, 141.5, 209.75, 3.745067879355313, 3.4904615190095636, 1.0606149267705478], "isController": false}, {"data": ["bonds-issue-conditions", 1206, 1206, 100.0, 98.19734660033184, 78, 826, 95.0, 110.0, 117.0, 173.65000000000032, 20.161155505031928, 18.784110630370456, 3.6817735150790734], "isController": false}, {"data": ["currencies", 30, 30, 100.0, 110.43333333333334, 83, 622, 90.5, 107.80000000000001, 343.14999999999964, 622.0, 0.5150303009493725, 0.4803093454394067, 0.09958593709763257], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["521", 15594, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15594, 15594, "521", 15594, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["yield-curves", 243, 243, "521", 243, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-uuid", 1252, 1252, "521", 1252, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 592, 592, "521", 592, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1199, 1199, "521", 1199, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-metrics", 507, 507, "521", 507, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-laws", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 25, 25, "521", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid-metrics", 600, 600, "521", 600, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments", 1257, 1257, "521", 1257, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["instrument-issuers", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies-uuid", 1200, 1200, "521", 1200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, "521", 120, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-coupons", 260, 260, "521", 260, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["markets-uuid", 1203, 1203, "521", 1203, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-params", 1264, 1264, "521", 1264, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["debt-types", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-metrics", 1258, 1258, "521", 1258, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-uuid", 1213, 1213, "521", 1213, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-screener-filter", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid", 595, 595, "521", 595, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, "521", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast", 1206, 1206, "521", 1206, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-payment-summary", 224, 224, "521", 224, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-issue-conditions", 1206, 1206, "521", 1206, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
