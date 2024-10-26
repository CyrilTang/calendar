const commonUrl = "https://"; //公共路径

// post请求封装
function postRequest(url, data) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: commonUrl + url,
            data: data,
            method: "POST", // 修改为POST
            header: {
                "content-type": "application/json", // 根据实际情况调整
                token: uni.getStorageSync("token")
            },
            success: res => {
                if (res.statusCode === 200) {
                    resolve(res.data);
                } else {
                    reject(new Error(`Server returned status code ${res.statusCode}: ${res.data}`));
                }
            },
            fail: err => {
                reject(new Error(`Network error: ${err}`));
            }
        });
    });
}

// get请求封装
function getRequest(url, data) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: commonUrl + url,
            data: data,
            method: "GET",
            header: {
                "content-type": "application/json"
            },
            success: res => {
                if (res.statusCode === 200) {
                    resolve(res.data);
                } else {
                    reject(new Error(`Server returned status code ${res.statusCode}: ${res.data}`));
                }
            },
            fail: err => {
                reject(new Error(`Network error: ${err}`));
            }
        });
    });
}

module.exports = {
    post: postRequest,
    get: getRequest
};