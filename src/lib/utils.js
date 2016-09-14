module.exports = (function (){

    function toArray(val) {
        return (typeof val) === 'string' ? [val] : val;
    }

    function extend(mainObj, appendObj) {
        var i, ii, key, data = {};

        for (key in mainObj) {
            if (typeof mainObj[key] === 'object') {
                data[key] = extend(mainObj[key], []);
            }
            else {
                data[key] = mainObj[key];
            }
        }

        for (i = 0, ii = appendObj.length; i < ii; i++) {
            for (key in appendObj[i]) {
                if (typeof appendObj[i][key] === 'object') {
                    data[key] = extend(mainObj[key] || {}, [appendObj[i][key]]);
                }
                else  {
                    data[key] = appendObj[i][key];
                }
            }
        }

        return data;
    }

    function compare(one, two) {
        var i, ii, key;

        if (typeof one === 'object' && typeof two === 'object') {
            for (key in one) {
                if (compare(one[key], two[key])) {
                    return true;
                }
            }

            return false;
        }

        one = toArray(one);
        two = toArray(two);

        if (one.constructor !== Array || two.constructor !== Array) {
            return false;
        }

        for (i = 0, ii = one.length; i < ii; i++) {
            if (two.indexOf(one[i]) >= 0) {
                return true;
            }
        }

        return false;
    }

    return {
        extend: extend,
        toArray: toArray,
        compare: compare
    };
})();