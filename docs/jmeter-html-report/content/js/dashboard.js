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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "tradable-securities-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves"], "isController": false}, {"data": [0.0, 500, 1500, "appraiser-5-tickers-dinamico"], "isController": false}, {"data": [0.0, 500, 1500, "bond-payment-forecast-cashflow"], "isController": false}, {"data": [0.0, 500, 1500, "investments-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "investments-exchange-rate-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bond-laws"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves-uuid-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "investments"], "isController": false}, {"data": [0.0, 500, 1500, "currencies-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "instrument-issuers"], "isController": false}, {"data": [0.0, 500, 1500, "investments-price-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-coupons"], "isController": false}, {"data": [0.0, 500, 1500, "markets-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-params"], "isController": false}, {"data": [0.0, 500, 1500, "debt-types"], "isController": false}, {"data": [0.0, 500, 1500, "tradable-securities-metrics"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "bond-screener-filter"], "isController": false}, {"data": [0.0, 500, 1500, "yield-curves-uuid"], "isController": false}, {"data": [0.0, 500, 1500, "investments-irr-sensitivity"], "isController": false}, {"data": [0.0, 500, 1500, "bond-payment-forecast"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-payment-summary"], "isController": false}, {"data": [0.0, 500, 1500, "currencies"], "isController": false}, {"data": [0.0, 500, 1500, "bonds-issue-conditions"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 14899, 14899, 100.0, 102.22618967715998, 77, 9042, 94.0, 111.0, 118.0, 154.0, 196.76439513998943, 183.29261743512282, 67.08833479843503], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["tradable-securities-uuid", 1193, 1193, 100.0, 99.28164291701589, 79, 3024, 93.0, 110.0, 116.0, 153.23999999999978, 19.92684026791829, 18.556220795612088, 3.5806041106415676], "isController": false}, {"data": ["yield-curves", 243, 243, 100.0, 99.65843621399178, 80, 776, 94.0, 110.6, 118.39999999999995, 155.60000000000008, 4.063477199377937, 3.7873334580525406, 0.9642821869617565], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 602, 602, 100.0, 95.62790697674416, 80, 258, 93.0, 109.0, 112.0, 124.97000000000003, 10.342754058929645, 9.646585210677777, 11.68059686667812], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1140, 1140, 100.0, 103.93333333333332, 80, 6026, 94.0, 113.0, 124.0, 160.0, 19.040301972508477, 17.746515280259885, 9.799061659679655], "isController": false}, {"data": ["investments-metrics", 506, 506, 100.0, 98.05731225296444, 79, 700, 94.0, 111.0, 116.0, 162.72000000000003, 8.445861361018844, 7.867513243603011, 1.2289388113201247], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 25, 25, 100.0, 223.56000000000003, 81, 3246, 96.0, 119.80000000000003, 2310.299999999998, 3246.0, 0.4207266791201764, 0.3829763204506824, 0.07642105694956329], "isController": false}, {"data": ["bond-laws", 30, 30, 100.0, 104.66666666666666, 82, 406, 93.5, 109.80000000000001, 244.8499999999998, 406.0, 0.5107078410677198, 0.4764112826001839, 0.06832712326784925], "isController": false}, {"data": ["yield-curves-uuid-metrics", 599, 599, 100.0, 96.96327212020033, 81, 772, 93.0, 109.0, 113.0, 130.0, 10.008688677984226, 9.324908909863321, 2.5021721694960566], "isController": false}, {"data": ["investments", 966, 966, 100.0, 122.76293995859223, 78, 9042, 93.0, 109.0, 116.0, 162.33000000000004, 16.126339688157323, 15.006623448507563, 6.9292865847551], "isController": false}, {"data": ["currencies-uuid", 1114, 1114, 100.0, 106.39138240574503, 78, 8535, 94.0, 115.0, 124.0, 167.89999999999873, 18.58308172218793, 17.306775281707175, 4.2646720749161755], "isController": false}, {"data": ["instrument-issuers", 30, 30, 100.0, 97.83333333333331, 86, 137, 95.0, 109.9, 133.7, 137.0, 0.5576519136754837, 0.5194041082681191, 0.07950896425451234], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, 100.0, 102.3166666666667, 81, 696, 93.5, 111.0, 133.89999999999998, 583.8599999999958, 2.0524749427017412, 1.912519803176205, 0.3627909810830226], "isController": false}, {"data": ["bonds-coupons", 261, 261, 100.0, 98.82375478927204, 79, 659, 94.0, 111.80000000000001, 122.89999999999998, 142.14, 4.3663008565310495, 4.066499959222765, 0.7589858910766862], "isController": false}, {"data": ["markets-uuid", 1144, 1144, 100.0, 103.7036713286713, 77, 6032, 95.0, 113.0, 122.0, 152.29999999999973, 19.06507791017415, 17.757423209524205, 3.2023373052245643], "isController": false}, {"data": ["tradable-securities-params", 1222, 1222, 100.0, 96.92307692307692, 79, 696, 94.0, 109.0, 113.0, 150.8499999999999, 20.412254034009287, 19.01941353919587, 3.9668345241873517], "isController": false}, {"data": ["debt-types", 31, 31, 100.0, 304.03225806451604, 79, 6542, 95.0, 115.4, 2687.599999999991, 6542.0, 0.5319879187259748, 0.48643779388042285, 0.07169368435955518], "isController": false}, {"data": ["tradable-securities-metrics", 1196, 1196, 100.0, 99.05183946488292, 79, 3026, 93.0, 109.0, 115.0, 162.05999999999995, 19.977617051130007, 18.605760999381964, 3.745803197086876], "isController": false}, {"data": ["bonds-uuid", 1202, 1202, 100.0, 98.54658901830298, 79, 776, 95.0, 113.0, 121.0, 157.82000000000016, 20.07850998079011, 18.71119197882736, 4.705900776747682], "isController": false}, {"data": ["bond-screener-filter", 30, 30, 100.0, 95.46666666666664, 80, 121, 93.5, 110.9, 116.6, 121.0, 0.5278530457120738, 0.4928518525442517, 0.36960022829644223], "isController": false}, {"data": ["yield-curves-uuid", 605, 605, 100.0, 97.2462809917355, 80, 769, 94.0, 108.0, 113.0, 132.75999999999976, 10.101178749123452, 9.40969019225632, 2.762041064213444], "isController": false}, {"data": ["investments-irr-sensitivity", 21, 21, 100.0, 99.19047619047619, 84, 135, 93.0, 124.6, 134.0, 135.0, 0.35816618911174786, 0.33363220489664347, 0.06155981375358167], "isController": false}, {"data": ["bond-payment-forecast", 1169, 1169, 100.0, 101.33276304533797, 79, 3031, 94.0, 111.0, 120.0, 147.0, 19.521400063457076, 18.192343559524407, 19.21637818746556], "isController": false}, {"data": ["bonds-payment-summary", 220, 220, 100.0, 99.67272727272729, 82, 682, 94.0, 109.0, 119.0, 160.15999999999997, 3.740033660302943, 3.4848985515869644, 1.0591892202029818], "isController": false}, {"data": ["currencies", 30, 30, 100.0, 123.43333333333334, 85, 776, 102.0, 115.0, 426.74999999999955, 776.0, 0.5096753368104517, 0.47511629623180035, 0.09855050457858344], "isController": false}, {"data": ["bonds-issue-conditions", 1200, 1200, 100.0, 98.76916666666678, 79, 767, 95.0, 112.90000000000009, 121.0, 152.98000000000002, 20.03974549523221, 18.67049335348441, 3.659601960555101], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["521", 14887, 99.9194576817236, 99.9194576817236], "isController": false}, {"data": ["409/Conflict", 12, 0.0805423182763944, 0.0805423182763944], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 14899, 14899, "521", 14887, "409/Conflict", 12, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["tradable-securities-uuid", 1193, 1193, "521", 1192, "409/Conflict", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves", 243, 243, "521", 243, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["appraiser-5-tickers-dinamico", 602, 602, "521", 602, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast-cashflow", 1140, 1140, "521", 1139, "409/Conflict", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["investments-metrics", 506, 506, "521", 506, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-exchange-rate-sensitivity", 25, 25, "521", 24, "409/Conflict", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["bond-laws", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid-metrics", 599, 599, "521", 599, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments", 966, 966, "521", 962, "409/Conflict", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["currencies-uuid", 1114, 1114, "521", 1113, "409/Conflict", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["instrument-issuers", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-price-sensitivity", 120, 120, "521", 120, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-coupons", 261, 261, "521", 261, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["markets-uuid", 1144, 1144, "521", 1143, "409/Conflict", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-params", 1222, 1222, "521", 1222, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["debt-types", 31, 31, "521", 30, "409/Conflict", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["tradable-securities-metrics", 1196, 1196, "521", 1195, "409/Conflict", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-uuid", 1202, 1202, "521", 1202, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-screener-filter", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["yield-curves-uuid", 605, 605, "521", 605, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["investments-irr-sensitivity", 21, 21, "521", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bond-payment-forecast", 1169, 1169, "521", 1168, "409/Conflict", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-payment-summary", 220, 220, "521", 220, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["currencies", 30, 30, "521", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["bonds-issue-conditions", 1200, 1200, "521", 1200, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
