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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "tradable-securities-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves"], "isController": false}, {"data": [0.0, 500, 1500, "appraiser-5-tickers-dinamico"], "isController": false}, {"data": [0.0, 500, 1500, "bond-payment-forecast-cashflow"], "isController": false}, {"data": [0.0, 500, 1500, "investments-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "investments-exchange-rate-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bond-laws"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves-uuid-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "investments"], "isController": false}, {"data": [0.0, 500, 1500, "currencies-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "instrument-issuers"], "isController": false}, {"data": [0.0, 500, 1500, "investments-price-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-coupons"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-params"], "isController": false}, {"data": [0.0, 500, 1500, "markets-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "debt-types"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "bond-screener-filter"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "investments-irr-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bond-payment-forecast"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-payment-summary"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-issue-conditions"], "isController": false}, {"data": [0.0, 500, 1500, "currencies"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13112, 13112, 100.0, 109.23482306284313, 20, 2390, 110.0, 124.0, 136.0, 334.869999999999, 129.22045924903912, 120.42084868064453, 44.5542902150882], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["tradable-securities-uuid", 991, 991, 100.0, 119.74672048435934, 97, 1334, 111.0, 124.0, 140.0, 331.4000000000002, 16.541754995075863, 15.414133310520958, 2.9723466006776946], "isController": false}, {"data": ["yield-curves", 243, 243, 100.0, 37.090534979423865, 20, 685, 32.0, 48.0, 57.39999999999995, 92.08000000000004, 4.071920505387335, 3.7919137869279624, 0.9662858230557836], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 604, 604, 100.0, 34.85099337748341, 21, 444, 32.0, 46.0, 54.0, 81.70000000000027, 10.433400701317995, 9.72446467283343, 11.782987100758323], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 968, 968, 100.0, 122.35640495867762, 99, 2390, 112.0, 129.0, 145.54999999999995, 328.92999999999984, 16.185396358285818, 15.098028214715669, 8.329788946109987], "isController": false}, {"data": ["investments-metrics", 504, 504, 100.0, 125.81944444444434, 100, 1327, 112.0, 130.5, 225.0, 339.9, 8.414304317339477, 7.840444641306888, 1.224347014925373], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, 100.0, 227.20833333333337, 104, 2287, 115.0, 352.0, 1842.0, 2287.0, 0.4499943750703116, 0.41923304083698953, 0.08173725953425581], "isController": false}, {"data": ["bond-laws", 30, 30, 100.0, 171.5, 103, 1349, 112.0, 277.10000000000014, 796.2499999999993, 1349.0, 0.538957655893502, 0.5022376567468516, 0.07210663950918923], "isController": false}, {"data": ["yield-curves-uuid-metrics", 603, 603, 100.0, 36.509121061359856, 21, 690, 32.0, 46.0, 55.59999999999991, 92.96000000000004, 10.06677796327212, 9.37247300187813, 2.51669449081803], "isController": false}, {"data": ["investments", 994, 994, 100.0, 119.26861167002026, 97, 1269, 111.0, 123.0, 135.0, 351.04999999999995, 16.602084446819884, 15.47967043233899, 7.133708160742918], "isController": false}, {"data": ["currencies-uuid", 979, 979, 100.0, 121.24821246169557, 99, 1430, 112.0, 125.0, 141.0, 329.0000000000009, 16.3177545169678, 15.205619827780184, 3.744797179186946], "isController": false}, {"data": ["instrument-issuers", 30, 30, 100.0, 198.96666666666667, 105, 1419, 113.0, 136.90000000000003, 1378.3, 1419.0, 0.526999964866669, 0.49092311180304254, 0.07513866686575554], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, 100.0, 140.10000000000005, 99, 1376, 111.0, 129.9, 234.09999999999934, 1369.6999999999998, 2.0738999688915007, 1.9318087918236493, 0.36657802184507965], "isController": false}, {"data": ["bonds-coupons", 263, 263, 100.0, 126.7718631178708, 96, 1343, 112.0, 125.6, 172.99999999999983, 511.1600000000052, 4.39402546195743, 4.094908939878705, 0.7638052072543189], "isController": false}, {"data": ["tradable-securities-params", 956, 956, 100.0, 124.00732217573236, 99, 2355, 112.0, 124.0, 136.14999999999998, 325.8799999999992, 15.971398499757758, 14.881023078963196, 3.103816700636517], "isController": false}, {"data": ["markets-uuid", 969, 969, 100.0, 122.4871001031992, 97, 1387, 112.0, 128.0, 142.5, 354.5999999999999, 16.158617929562435, 15.052559281616862, 2.7141428553561897], "isController": false}, {"data": ["debt-types", 30, 30, 100.0, 114.16666666666667, 100, 139, 112.0, 129.3, 134.6, 139.0, 0.5265837004791912, 0.4911695753102456, 0.070965381509891], "isController": false}, {"data": ["tradable-securities-metrics", 982, 982, 100.0, 120.74134419551945, 99, 1381, 111.0, 125.0, 136.0, 350.3399999999999, 16.408782541857434, 15.287757457683053, 3.076646726598269], "isController": false}, {"data": ["bonds-uuid", 973, 973, 100.0, 121.87564234326838, 98, 2363, 112.0, 125.0, 135.0, 344.3399999999999, 16.25242199505579, 15.145837117700607, 3.8091614050912006], "isController": false}, {"data": ["bond-screener-filter", 30, 30, 100.0, 117.90000000000003, 102, 323, 110.0, 122.60000000000001, 216.29999999999987, 323.0, 0.5161467921476869, 0.48130016301636186, 0.3614035644237221], "isController": false}, {"data": ["yield-curves-uuid", 608, 608, 100.0, 35.934210526315795, 21, 687, 32.0, 47.0, 56.0, 87.64999999999952, 10.166544043876664, 9.466829925673867, 2.7799143869975254], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, 100.0, 128.10000000000002, 104, 373, 113.0, 141.70000000000002, 361.49999999999983, 373.0, 0.37103686251229057, 0.34561866338608244, 0.06377196074429994], "isController": false}, {"data": ["bond-payment-forecast", 962, 962, 100.0, 123.23180873180867, 96, 2297, 112.0, 127.0, 140.0, 357.2500000000001, 16.072442944498277, 14.990937583536606, 15.821311023490495], "isController": false}, {"data": ["bonds-payment-summary", 221, 221, 100.0, 132.29864253393666, 98, 1408, 112.0, 126.80000000000001, 210.599999999999, 1181.860000000001, 3.724677250817406, 3.469994806940371, 1.0548402370478982], "isController": false}, {"data": ["bonds-issue-conditions", 976, 976, 100.0, 121.45389344262304, 99, 2386, 112.0, 127.0, 143.14999999999998, 334.46000000000004, 16.317795760048153, 15.204868483749081, 2.979909967899418], "isController": false}, {"data": ["currencies", 32, 32, 100.0, 113.09375, 103, 145, 111.0, 123.0, 138.49999999999997, 145.0, 0.5464107642920565, 0.5087249632880267, 0.10565364387678437], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["521", 13112, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 13112, 13112, "521", 13112, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["tradable-securities-uuid", 991, 991, "521", 991, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves", 243, 243, "521", 243, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 604, 604, "521", 604, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 968, 968, "521", 968, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-metrics", 504, 504, "521", 504, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 24, 24, "521", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-laws", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid-metrics", 603, 603, "521", 603, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments", 994, 994, "521", 994, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies-uuid", 979, 979, "521", 979, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["instrument-issuers", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, "521", 120, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-coupons", 263, 263, "521", 263, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-params", 956, 956, "521", 956, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["markets-uuid", 969, 969, "521", 969, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["debt-types", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-metrics", 982, 982, "521", 982, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-uuid", 973, 973, "521", 973, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-screener-filter", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid", 608, 608, "521", 608, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-irr-sensitivity", 20, 20, "521", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast", 962, 962, "521", 962, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-payment-summary", 221, 221, "521", 221, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-issue-conditions", 976, 976, "521", 976, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies", 32, 32, "521", 32, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
