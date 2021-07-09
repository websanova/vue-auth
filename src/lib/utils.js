function isObject(val) {
    if (val !== null && typeof val === 'object' && val.constructor !== Array ) {
        return true;
    }

    return false;
}

function toArray(val) {
    return (typeof val) === 'string' || (typeof val) === 'number' ? [val] : val;
}

function extend(mainObj, appendObj) {
    var i, ii, key, data = {};

    appendObj = appendObj || {};

    for (key in mainObj) {
        if (isObject(mainObj[key]) && mainObj[key].constructor.name !== 'FormData') {
            data[key] = extend(mainObj[key], {});
        }
        else {
            data[key] = mainObj[key];
        }
    }

    if (appendObj.constructor !== Array) {
        appendObj = [appendObj];
    }

    for (i = 0, ii = appendObj.length; i < ii; i++) {
        for (key in appendObj[i]) {
            if (isObject(appendObj[i][key]) && appendObj[i][key].constructor.name !== 'FormData') {
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

    if (Object.prototype.toString.call(one) === '[object Object]' && Object.prototype.toString.call(two) === '[object Object]') {
        for (key in one) {
            if (compare(one[key], two[key])) {
                return true;
            }
        }

        return false;
    }

    one = toArray(one);
    two = toArray(two);

    if (!one || !two || one.constructor !== Array || two.constructor !== Array) {
        return false;
    }

    for (i = 0, ii = one.length; i < ii; i++) {
        if (two.indexOf(one[i]) >= 0) {
            return true;
        }
    }

    return false;
}

function isLocalStorage() {
    try {
        if (!window.localStorage) {
            throw 'exception';
        }

        localStorage.setItem('storage_test', 1);
        localStorage.removeItem('storage_test');

        return true;
    } catch (e) {
        return false;
    }
}

function isSessionStorage() {
    try {
        if (!window.sessionStorage) {
            throw 'exception';
        }

        sessionStorage.setItem('storage_test', 1);
        sessionStorage.removeItem('storage_test');

        return true;
    } catch (e) {
        return false;
    }
}

function isCookieStorage() {
    return true;
}

function getProperty (obj, desc) {
    var arr = desc.split('.');

    while (arr.length) {
        obj = obj[arr.shift()];
    }

    return obj;
}

export {
    extend,
    compare,
    toArray,
    isObject,
    isLocalStorage,
    isCookieStorage,
    isSessionStorage,
    getProperty,
};