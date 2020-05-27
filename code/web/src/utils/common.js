import axios from './axios';

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params: params
            })
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                reject(err);
            });
    });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data).then(
            response => {
                resolve(response);
            },
            err => {
                reject(err);
            }
        );
    });
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data).then(
            response => {
                resolve(response);
            },
            err => {
                reject(err);
            }
        );
    });
}

/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function del(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.delete(url, data).then(
            response => {
                resolve(response);
            },
            err => {
                reject(err);
            }
        );
    });
}
