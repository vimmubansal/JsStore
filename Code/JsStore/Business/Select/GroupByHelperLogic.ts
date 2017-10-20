module JsStore {
    export module Business {
        export module Select {
            export class GroupByHelper extends Where {
                constructor() {
                    super();
                }

                private executeAggregateGroupBy = function () {
                    var GrpQry = this.Query.GroupBy,
                        Datas = this.Results,
                        LookUpObj = {};
                    //free results memory
                    this.Results = undefined;
                    //assign aggregate and free aggregate memory
                    var AggregateQry = this.Query.Aggregate;
                    this.Query.Aggregate = undefined;
                    var Index, ObjKey, Value, AggrColumn;
                    var calculateAggregate = function () {
                        for (var prop in AggregateQry) {
                            switch (prop) {
                                case 'Count':
                                    var getCount = function () {
                                        Value = LookUpObj[ObjKey];
                                        //get old value
                                        Value = Value ? Value["Count(" + AggrColumn + ")"] : 0;
                                        //add with old value if data exist
                                        Value += Datas[Index][AggrColumn] ? 1 : 0;
                                        return Value;
                                    }
                                    if (typeof AggregateQry[prop] == 'string') {
                                        AggrColumn = AggregateQry[prop];
                                        Datas[Index]["Count(" + AggrColumn + ")"] = getCount();
                                    }
                                    else if (Array.isArray(AggregateQry[prop])) {
                                        for (var item in AggregateQry[prop]) {
                                            AggrColumn = AggregateQry[prop][item];
                                            Datas[Index]["Count(" + AggrColumn + ")"] = getCount();
                                        }
                                    }
                                    break;
                                case 'Max':
                                    var getMax = function () {
                                        Value = LookUpObj[ObjKey];
                                        //get old value
                                        Value = Value ? Value["Max(" + AggrColumn + ")"] : 0;
                                        Datas[Index][AggrColumn] = Datas[Index][AggrColumn] ? Datas[Index][AggrColumn] : 0;
                                        //compare between old value and new value
                                        return Value > Datas[Index][AggrColumn] ? Value : Datas[Index][AggrColumn];
                                    }

                                    if (typeof AggregateQry[prop] == 'string') {
                                        AggrColumn = AggregateQry[prop];
                                        Datas[Index]["Max(" + AggrColumn + ")"] = getMax();
                                    }
                                    else if (Array.isArray(AggregateQry[prop])) {
                                        for (var item in AggregateQry[prop]) {
                                            AggrColumn = AggregateQry[prop][item];
                                            Datas[Index]["Max(" + AggrColumn + ")"] = getMax();
                                        }
                                    }
                                    break;
                                case 'Min':
                                    var getMin = function () {
                                        Value = LookUpObj[ObjKey];
                                        //get old value
                                        Value = Value ? Value["Min(" + AggrColumn + ")"] : 0;
                                        Datas[Index][AggrColumn] = Datas[Index][AggrColumn] ? Datas[Index][AggrColumn] : 0;
                                        //compare between old value and new value
                                        return Value < Datas[Index][AggrColumn] ? Value : Datas[Index][AggrColumn];
                                    }

                                    if (typeof AggregateQry[prop] == 'string') {
                                        AggrColumn = AggregateQry[prop];
                                        Datas[Index]["Min(" + AggrColumn + ")"] = getMin();
                                    }
                                    else if (Array.isArray(AggregateQry[prop])) {
                                        for (var item in AggregateQry[prop]) {
                                            AggrColumn = AggregateQry[prop][item];
                                            Datas[Index]["Min(" + AggrColumn + ")"] = getMin();
                                        }
                                    }
                                    break;
                                case 'Sum':
                                    var getSum = function () {
                                        Value = LookUpObj[ObjKey];
                                        //get old value
                                        Value = Value ? Value["Sum(" + AggrColumn + ")"] : 0;
                                        //add with old value if data exist
                                        Value += Datas[Index][AggrColumn] ? Datas[Index][AggrColumn] : 0;
                                        return Value;
                                    }
                                    if (typeof AggregateQry[prop] == 'string') {
                                        AggrColumn = AggregateQry[prop];
                                        Datas[Index]["Sum(" + AggrColumn + ")"] = getSum();
                                    }
                                    else if (Array.isArray(AggregateQry[prop])) {
                                        for (var item in AggregateQry[prop]) {
                                            AggrColumn = AggregateQry[prop][item];
                                            Datas[Index]["Sum(" + AggrColumn + ")"] = getSum();
                                        }
                                    }
                                    break;
                                case 'Avg':
                                    var getAvg = function () {
                                        Value = LookUpObj[ObjKey];
                                        //get old value
                                        Value = Value ? Value["Avg(" + AggrColumn + ")"] : 0;
                                        //add with old value if data exist
                                        Value += Datas[Index][AggrColumn] ? Datas[Index][AggrColumn] : 0;
                                        return Value / Datas.length;
                                    }

                                    if (typeof AggregateQry[prop] == 'string') {
                                        AggrColumn = AggregateQry[prop];
                                        Datas[Index]["Avg(" + AggrColumn + ")"] = getAvg();
                                    }
                                    else if (Array.isArray(AggregateQry[prop])) {
                                        for (var item in AggregateQry[prop]) {
                                            AggrColumn = AggregateQry[prop][item];
                                            Datas[Index]["Avg(" + AggrColumn + ")"] = getAvg();
                                        }
                                    }
                                    break;
                            }
                        }
                    }

                    if (typeof GrpQry == 'string') {
                        for (Index in Datas) {
                            ObjKey = Datas[Index][GrpQry];
                            calculateAggregate();
                            LookUpObj[ObjKey] = Datas[Index];
                        }
                    }
                    else {
                        for (Index in Datas) {
                            ObjKey = "";
                            for (var column in GrpQry) {
                                ObjKey += Datas[Index][GrpQry[column]];
                            }
                            calculateAggregate();
                            LookUpObj[ObjKey] = Datas[Index];
                        }

                    }

                    //free datas memory
                    Datas = [];
                    for (var i in LookUpObj) {
                        Datas.push(LookUpObj[i]);
                    }
                    this.Results = Datas;
                };

                protected processGroupBy = function (key) {
                    var GrpQry = this.Query.GroupBy,
                        Datas = this.Results,
                        LookUpObj = {};
                    //free results memory
                    this.Results = undefined;
                    if (typeof GrpQry == 'string') {
                        for (var i in Datas) {
                            LookUpObj[Datas[i][key]] = Datas[i];
                        }
                    }
                    else {
                        var ObjKey;
                        for (var i in Datas) {
                            ObjKey = "";
                            for (var column in GrpQry) {
                                ObjKey += Datas[i][GrpQry[column]];
                            }
                            LookUpObj[ObjKey] = Datas[i];
                        }
                    }
                    //free datas memory
                    Datas = [];
                    for (i in LookUpObj) {
                        Datas.push(LookUpObj[i]);
                    }
                    this.Results = Datas;
                };
            }
        }
    }
}